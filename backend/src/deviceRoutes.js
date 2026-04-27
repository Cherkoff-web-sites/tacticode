import express from "express";
import { authMiddleware, signToken } from "./authRoutes.js";
import { query } from "./db.js";

const router = express.Router();
const MAX_DEVICES = 3;
const DEVICE_UNLINK_COOLDOWN_MINUTES = 10;

function getCurrentDeviceId(req) {
  const raw = req.headers["x-device-id"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function rotateActiveSession(userId) {
  const result = await query(
    `UPDATE users
     SET session_version = session_version + 1,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, login, email, role, session_version`,
    [userId]
  );

  return signToken(result.rows[0]);
}

router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await query(
      "SELECT id, device_key, device_name, display_name, device_type, created_at, last_active_at FROM devices WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    return res.json({ devices: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/register", authMiddleware, async (req, res) => {
  const { device_key, device_name, device_type } = req.body || {};

  if (!device_name || !device_type) {
    return res.status(400).json({ error: "device_name и device_type обязательны" });
  }

  const normalizedDeviceKey = device_key ? String(device_key).trim().slice(0, 128) : null;

  try {
    if (normalizedDeviceKey) {
      const existingByKey = await query(
        `UPDATE devices
         SET device_name = $3,
             device_type = $4,
             last_active_at = NOW()
         WHERE user_id = $1 AND device_key = $2
         RETURNING id, device_key, device_name, display_name, device_type, created_at, last_active_at`,
        [req.user.id, normalizedDeviceKey, device_name, device_type]
      );

      if (existingByKey.rowCount > 0) {
        const accessToken = await rotateActiveSession(req.user.id);
        return res.json({ device: existingByKey.rows[0], accessToken });
      }
    }

    const currentDeviceId = getCurrentDeviceId(req);
    if (currentDeviceId) {
      const existingById = await query(
        `UPDATE devices
         SET device_key = COALESCE($3, device_key),
             device_name = $4,
             device_type = $5,
             last_active_at = NOW()
         WHERE id = $1 AND user_id = $2
         RETURNING id, device_key, device_name, display_name, device_type, created_at, last_active_at`,
        [currentDeviceId, req.user.id, normalizedDeviceKey, device_name, device_type]
      );

      if (existingById.rowCount > 0) {
        const accessToken = await rotateActiveSession(req.user.id);
        return res.json({ device: existingById.rows[0], accessToken });
      }
    }

    const current = await query(
      "SELECT id FROM devices WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    if (current.rowCount >= MAX_DEVICES) {
      return res
        .status(409)
        .json({ error: "Достигнут лимит устройств (3). Удалите одно из устройств в личном кабинете." });
    }

    const result = await query(
      `INSERT INTO devices (user_id, device_key, device_name, device_type)
       VALUES ($1, $2, $3, $4)
       RETURNING id, device_key, device_name, display_name, device_type, created_at, last_active_at`,
      [req.user.id, normalizedDeviceKey, device_name, device_type]
    );

    const accessToken = await rotateActiveSession(req.user.id);
    return res.status(201).json({ device: result.rows[0], accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Некорректный идентификатор устройства" });
  }

  const displayName = String(req.body?.display_name || "").trim().slice(0, 80);
  if (!displayName) {
    return res.status(400).json({ error: "Название устройства обязательно" });
  }

  try {
    const result = await query(
      `UPDATE devices
       SET display_name = $3
       WHERE id = $1 AND user_id = $2
       RETURNING id, device_key, device_name, display_name, device_type, created_at, last_active_at`,
      [id, req.user.id, displayName]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Устройство не найдено" });
    }

    return res.json({ device: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Некорректный идентификатор устройства" });
  }

  try {
    const userResult = await query(
      "SELECT last_device_unlinked_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const lastUnlinkedAt = userResult.rows[0].last_device_unlinked_at;
    if (lastUnlinkedAt) {
      const nextAllowedAt = new Date(lastUnlinkedAt);
      nextAllowedAt.setMinutes(nextAllowedAt.getMinutes() + DEVICE_UNLINK_COOLDOWN_MINUTES);

      if (nextAllowedAt.getTime() > Date.now()) {
        return res.status(429).json({
          error: "Отвязать устройство можно не чаще 1 раза в 10 минут.",
          retryAt: nextAllowedAt.toISOString(),
        });
      }
    }

    const result = await query("DELETE FROM devices WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Устройство не найдено" });
    }

    await query(
      "UPDATE users SET last_device_unlinked_at = NOW(), updated_at = NOW() WHERE id = $1",
      [req.user.id]
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;

