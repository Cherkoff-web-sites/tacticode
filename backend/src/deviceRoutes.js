import express from "express";
import { authMiddleware } from "./authRoutes.js";
import { query } from "./db.js";

const router = express.Router();

// Временно 2 для проверки квоты (боевой план — 3).
const MAX_DEVICES = 2;
const DEVICE_UNLINK_COOLDOWN_MINUTES = 10;
const APP_CLIENT = "app";
const WEB_CLIENTS = new Set(["web", "browser"]);

function getCurrentDeviceId(req) {
  const raw = req.headers["x-device-id"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function normalizeClient(rawClient, deviceType) {
  const fromBody = String(rawClient || "").trim().toLowerCase();
  if (fromBody) {
    if (WEB_CLIENTS.has(fromBody)) return "web";
    if (fromBody === APP_CLIENT) return APP_CLIENT;
  }

  const type = String(deviceType || "").trim().toLowerCase();
  if (WEB_CLIENTS.has(type)) return "web";

  // Без явного client сайт больше не регистрирует устройства.
  // Пропуск client = app — совместимость с текущим UE5.
  return APP_CLIENT;
}

function deviceSelectFields() {
  return `id, device_key, device_name, display_name, device_type, client, created_at, last_active_at`;
}

router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await query(
      `SELECT ${deviceSelectFields()}
       FROM devices
       WHERE user_id = $1 AND client = $2
       ORDER BY created_at DESC`,
      [req.user.id, APP_CLIENT]
    );
    return res.json({ devices: result.rows, maxDevices: MAX_DEVICES });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/register", authMiddleware, async (req, res) => {
  const { device_key, device_name, device_type, client: rawClient } = req.body || {};

  if (!device_name || !device_type) {
    return res.status(400).json({ error: "device_name и device_type обязательны" });
  }

  const client = normalizeClient(rawClient, device_type);

  // Браузерные сессии не пишем в квоту и не трогаем JWT других клиентов.
  if (client !== APP_CLIENT) {
    return res.json({
      skipped: true,
      reason: "web_client_ignored",
      device: null,
      maxDevices: MAX_DEVICES,
    });
  }

  const normalizedDeviceKey = device_key ? String(device_key).trim().slice(0, 128) : null;

  try {
    if (normalizedDeviceKey) {
      const existingByKey = await query(
        `UPDATE devices
         SET device_name = $3,
             device_type = $4,
             client = $5,
             last_active_at = NOW()
         WHERE user_id = $1 AND device_key = $2 AND client = $5
         RETURNING ${deviceSelectFields()}`,
        [req.user.id, normalizedDeviceKey, device_name, device_type, APP_CLIENT]
      );

      if (existingByKey.rowCount > 0) {
        // Тот же инсталл приложения — без ротации session_version (сайт и другие app-сессии живут).
        return res.json({
          device: existingByKey.rows[0],
          skipped: false,
          maxDevices: MAX_DEVICES,
        });
      }
    }

    const currentDeviceId = getCurrentDeviceId(req);
    if (currentDeviceId) {
      const existingById = await query(
        `UPDATE devices
         SET device_key = COALESCE($3, device_key),
             device_name = $4,
             device_type = $5,
             client = $6,
             last_active_at = NOW()
         WHERE id = $1 AND user_id = $2 AND client = $6
         RETURNING ${deviceSelectFields()}`,
        [currentDeviceId, req.user.id, normalizedDeviceKey, device_name, device_type, APP_CLIENT]
      );

      if (existingById.rowCount > 0) {
        return res.json({
          device: existingById.rows[0],
          skipped: false,
          maxDevices: MAX_DEVICES,
        });
      }
    }

    const current = await query(
      "SELECT id FROM devices WHERE user_id = $1 AND client = $2 ORDER BY created_at DESC",
      [req.user.id, APP_CLIENT]
    );

    if (current.rowCount >= MAX_DEVICES) {
      const legacyDevice = await query(
        `UPDATE devices
         SET device_key = $2,
             device_name = $3,
             device_type = $4,
             client = $5,
             last_active_at = NOW()
         WHERE id = (
           SELECT id
           FROM devices
           WHERE user_id = $1 AND client = $5 AND device_key IS NULL
           ORDER BY created_at ASC, id ASC
           LIMIT 1
         )
         RETURNING ${deviceSelectFields()}`,
        [req.user.id, normalizedDeviceKey, device_name, device_type, APP_CLIENT]
      );

      if (legacyDevice.rowCount > 0) {
        return res.json({
          device: legacyDevice.rows[0],
          skipped: false,
          maxDevices: MAX_DEVICES,
        });
      }

      return res.status(409).json({
        error: `Достигнут лимит устройств (${MAX_DEVICES}). Удалите одно из устройств в личном кабинете.`,
        maxDevices: MAX_DEVICES,
        code: "DEVICE_LIMIT_REACHED",
      });
    }

    const result = await query(
      `INSERT INTO devices (user_id, device_key, device_name, device_type, client)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${deviceSelectFields()}`,
      [req.user.id, normalizedDeviceKey, device_name, device_type, APP_CLIENT]
    );

    return res.status(201).json({
      device: result.rows[0],
      skipped: false,
      maxDevices: MAX_DEVICES,
    });
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
       WHERE id = $1 AND user_id = $2 AND client = $4
       RETURNING ${deviceSelectFields()}`,
      [id, req.user.id, displayName, APP_CLIENT]
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

    const result = await query(
      "DELETE FROM devices WHERE id = $1 AND user_id = $2 AND client = $3",
      [id, req.user.id, APP_CLIENT]
    );
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
