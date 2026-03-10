import express from "express";
import { query } from "./db.js";
import { authMiddleware } from "./authRoutes.js";

const router = express.Router();

// Для боевого режима можно вынести в env (например, 30 дней),
// но по ТЗ сейчас тестовые длительности: год = 2 минуты, месяц = 1 минута.
const TEST_YEAR_MS = 2 * 60 * 1000;
const TEST_MONTH_MS = 1 * 60 * 1000;

function getNowMoscow() {
  // Текущее время в часовом поясе Europe/Moscow
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })
  );
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
  };
}

// Получить все подписки текущего пользователя
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await query(
      "SELECT id, sport_id, plan, method, started_at, expires_at FROM subscriptions WHERE user_id = $1 ORDER BY created_at ASC",
      [req.user.id]
    );

    const subscriptions = result.rows.map(normalizeSubscriptionRow);
    return res.json({ subscriptions });
  } catch (err) {
    console.error("GET /api/subscriptions error:", err);
    return res.status(500).json({ error: "Ошибка сервера при получении подписок" });
  }
});

// Активировать/обновить подписку
router.post("/activate", authMiddleware, async (req, res) => {
  const { sportId, plan, method } = req.body || {};

  if (!sportId || !plan || !method) {
    return res.status(400).json({ error: "sportId, plan и method обязательны" });
  }

  if (!["month", "year"].includes(plan)) {
    return res.status(400).json({ error: "Неверный план подписки" });
  }

  if (!["card", "qr"].includes(method)) {
    return res.status(400).json({ error: "Неверный способ активации" });
  }

  try {
    const now = getNowMoscow();
    const durationMs = plan === "year" ? TEST_YEAR_MS : TEST_MONTH_MS;
    const expiresAt = new Date(now.getTime() + durationMs);

    // upsert по (user_id, sport_id)
    await query(
      `INSERT INTO subscriptions (user_id, sport_id, plan, method, started_at, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, sport_id)
       DO UPDATE SET
         plan = EXCLUDED.plan,
         method = EXCLUDED.method,
         started_at = EXCLUDED.started_at,
         expires_at = EXCLUDED.expires_at,
         updated_at = NOW()`,
      [req.user.id, sportId, plan, method, now.toISOString(), expiresAt.toISOString()]
    );

    const result = await query(
      "SELECT id, sport_id, plan, method, started_at, expires_at FROM subscriptions WHERE user_id = $1 ORDER BY created_at ASC",
      [req.user.id]
    );

    const subscriptions = result.rows.map(normalizeSubscriptionRow);
    return res.json({ subscriptions });
  } catch (err) {
    console.error("POST /api/subscriptions/activate error:", err);
    return res.status(500).json({ error: "Ошибка сервера при активации подписки" });
  }
});

export default router;

