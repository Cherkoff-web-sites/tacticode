import express from "express";
import { adminMiddleware, SUPER_ADMIN_ROLE } from "./authRoutes.js";
import { pool, query } from "./db.js";

const router = express.Router();

function normalizeBirthDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const stringValue = String(value).trim();
  const match = stringValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function normalizeAdminUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    login: row.login,
    email: row.email || null,
    role: row.role || "user",
    surname: row.surname || "",
    firstName: row.first_name || "",
    birthDate: normalizeBirthDate(row.birth_date),
    club: row.club || "",
    sessionVersion: Number(row.session_version ?? 1),
    registeredAt: row.registered_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
    devicesCount: Number(row.devices_count ?? 0),
    activeSubscriptionsCount: Number(row.active_subscriptions_count ?? 0),
    historyCount: Number(row.history_count ?? 0),
    activeCodesCount: Number(row.active_codes_count ?? 0),
    lastPurchaseAt: row.last_purchase_at || null,
    lastDeviceActiveAt: row.last_device_active_at || null,
    nearestCodeExpiresAt: row.nearest_code_expires_at || null,
  };
}

function normalizeDeviceRow(row) {
  return {
    id: row.id,
    name: row.display_name || row.device_name,
    defaultName: row.device_name,
    displayName: row.display_name || "",
    deviceType: row.device_type,
    createdAt: row.created_at,
    lastActiveAt: row.last_active_at,
  };
}

function normalizeSubscriptionRow(row) {
  return {
    dbId: row.id,
    id: row.sport_id,
    sportId: row.sport_id,
    plan: row.plan,
    method: row.method,
    startedAt: row.started_at,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeHistoryRow(row) {
  return {
    id: row.id,
    sportId: row.sport_id,
    plan: row.plan,
    method: row.method,
    amountRub: row.amount_rub,
    startedAt: row.started_at,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

function normalizeCodeRow(row) {
  return {
    id: row.id,
    email: row.email,
    code: row.code,
    purpose: row.purpose,
    login: row.login || null,
    userId: row.user_id || null,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    usedAt: row.used_at || null,
  };
}

function parseUserId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

router.get("/users", adminMiddleware, async (_req, res) => {
  try {
    const result = await query(
      `SELECT
         u.id,
         u.login,
         u.email,
         u.role,
         u.surname,
         u.first_name,
         u.birth_date,
         u.club,
         u.session_version,
         u.registered_at,
         u.created_at,
         u.updated_at,
         COALESCE(device_metrics.devices_count, 0) AS devices_count,
         device_metrics.last_device_active_at,
         COALESCE(subscription_metrics.active_subscriptions_count, 0) AS active_subscriptions_count,
         COALESCE(history_metrics.history_count, 0) AS history_count,
         history_metrics.last_purchase_at,
         COALESCE(code_metrics.active_codes_count, 0) AS active_codes_count,
         code_metrics.nearest_code_expires_at
       FROM users u
       LEFT JOIN LATERAL (
         SELECT COUNT(*)::int AS devices_count,
                MAX(last_active_at) AS last_device_active_at
         FROM devices
         WHERE user_id = u.id
       ) AS device_metrics ON TRUE
       LEFT JOIN LATERAL (
         SELECT COUNT(*)::int AS active_subscriptions_count
         FROM subscriptions
         WHERE user_id = u.id
           AND expires_at > NOW()
       ) AS subscription_metrics ON TRUE
       LEFT JOIN LATERAL (
         SELECT COUNT(*)::int AS history_count,
                MAX(created_at) AS last_purchase_at
         FROM subscription_history
         WHERE user_id = u.id
       ) AS history_metrics ON TRUE
       LEFT JOIN LATERAL (
         SELECT COUNT(*)::int AS active_codes_count,
                MIN(expires_at) AS nearest_code_expires_at
         FROM auth_codes
         WHERE used_at IS NULL
           AND expires_at > NOW()
           AND (
             user_id = u.id
             OR email = u.email
             OR login = u.login
           )
       ) AS code_metrics ON TRUE
       ORDER BY u.registered_at DESC, u.id DESC`
    );

    return res.json({
      users: result.rows.map(normalizeAdminUserRow),
    });
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/users/:id", adminMiddleware, async (req, res) => {
  const userId = parseUserId(req.params.id);
  if (!userId) {
    return res.status(400).json({ error: "Некорректный идентификатор пользователя" });
  }

  try {
    const userResult = await query(
      `SELECT
         u.id,
         u.login,
         u.email,
         u.role,
         u.surname,
         u.first_name,
         u.birth_date,
         u.club,
         u.session_version,
         u.registered_at,
         u.created_at,
         u.updated_at,
         COALESCE(device_metrics.devices_count, 0) AS devices_count,
         device_metrics.last_device_active_at,
         COALESCE(subscription_metrics.active_subscriptions_count, 0) AS active_subscriptions_count,
         COALESCE(history_metrics.history_count, 0) AS history_count,
         history_metrics.last_purchase_at,
         COALESCE(code_metrics.active_codes_count, 0) AS active_codes_count,
         code_metrics.nearest_code_expires_at
       FROM users u
       LEFT JOIN LATERAL (
         SELECT COUNT(*)::int AS devices_count,
                MAX(last_active_at) AS last_device_active_at
         FROM devices
         WHERE user_id = u.id
       ) AS device_metrics ON TRUE
       LEFT JOIN LATERAL (
         SELECT COUNT(*)::int AS active_subscriptions_count
         FROM subscriptions
         WHERE user_id = u.id
           AND expires_at > NOW()
       ) AS subscription_metrics ON TRUE
       LEFT JOIN LATERAL (
         SELECT COUNT(*)::int AS history_count,
                MAX(created_at) AS last_purchase_at
         FROM subscription_history
         WHERE user_id = u.id
       ) AS history_metrics ON TRUE
       LEFT JOIN LATERAL (
         SELECT COUNT(*)::int AS active_codes_count,
                MIN(expires_at) AS nearest_code_expires_at
         FROM auth_codes
         WHERE used_at IS NULL
           AND expires_at > NOW()
           AND (
             user_id = u.id
             OR email = u.email
             OR login = u.login
           )
       ) AS code_metrics ON TRUE
       WHERE u.id = $1
       LIMIT 1`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const userRow = userResult.rows[0];
    const [devicesResult, subscriptionsResult, historyResult, codesResult] = await Promise.all([
      query(
        `SELECT id, device_name, display_name, device_type, created_at, last_active_at
         FROM devices
         WHERE user_id = $1
         ORDER BY created_at DESC, id DESC`,
        [userId]
      ),
      query(
        `SELECT id, sport_id, plan, method, started_at, expires_at, created_at, updated_at
         FROM subscriptions
         WHERE user_id = $1
         ORDER BY created_at ASC, id ASC`,
        [userId]
      ),
      query(
        `SELECT id, sport_id, plan, method, amount_rub, started_at, expires_at, created_at
         FROM subscription_history
         WHERE user_id = $1
         ORDER BY created_at DESC, id DESC`,
        [userId]
      ),
      query(
        `SELECT id, email, code, purpose, login, user_id, created_at, expires_at, used_at
         FROM auth_codes
         WHERE used_at IS NULL
           AND expires_at > NOW()
           AND (
             user_id = $1
             OR email = $2
             OR login = $3
           )
         ORDER BY created_at DESC, id DESC`,
        [userId, userRow.email || null, userRow.login]
      ),
    ]);

    return res.json({
      user: normalizeAdminUserRow(userRow),
      devices: devicesResult.rows.map(normalizeDeviceRow),
      subscriptions: subscriptionsResult.rows.map(normalizeSubscriptionRow),
      history: historyResult.rows.map(normalizeHistoryRow),
      codes: codesResult.rows.map(normalizeCodeRow),
    });
  } catch (err) {
    console.error(`GET /api/admin/users/${req.params.id} error:`, err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.delete("/users/:id/devices/:deviceId", adminMiddleware, async (req, res) => {
  const userId = parseUserId(req.params.id);
  const deviceId = parseUserId(req.params.deviceId);
  if (!userId || !deviceId) {
    return res.status(400).json({ error: "Некорректный идентификатор пользователя или устройства" });
  }

  try {
    const result = await query(
      "DELETE FROM devices WHERE id = $1 AND user_id = $2",
      [deviceId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Устройство не найдено" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error(`DELETE /api/admin/users/${req.params.id}/devices/${req.params.deviceId} error:`, err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.delete("/users/:id", adminMiddleware, async (req, res) => {
  const userId = parseUserId(req.params.id);
  if (!userId) {
    return res.status(400).json({ error: "Некорректный идентификатор пользователя" });
  }

  if (userId === req.user.id) {
    return res.status(400).json({ error: "Нельзя удалить текущего супер-админа" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      "SELECT id, email, login, role FROM users WHERE id = $1 FOR UPDATE",
      [userId]
    );

    if (userResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const targetUser = userResult.rows[0];
    if (targetUser.role === SUPER_ADMIN_ROLE) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Нельзя удалить супер-админа" });
    }

    await client.query(
      `DELETE FROM auth_codes
       WHERE user_id = $1
          OR email = $2
          OR login = $3`,
      [userId, targetUser.email || null, targetUser.login]
    );

    await client.query("DELETE FROM users WHERE id = $1", [userId]);

    await client.query("COMMIT");
    return res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`DELETE /api/admin/users/${req.params.id} error:`, err);
    return res.status(500).json({ error: "Ошибка сервера" });
  } finally {
    client.release();
  }
});

export default router;
