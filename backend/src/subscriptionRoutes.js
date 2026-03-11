import express from "express";
import { query } from "./db.js";
import { authMiddleware } from "./authRoutes.js";

const router = express.Router();

// Для боевого режима можно вынести в env (например, 30 дней),
// но по ТЗ сейчас тестовые длительности: год = 2 минуты, месяц = 1 минута.
const TEST_YEAR_MS = 2 * 60 * 1000;
const TEST_MONTH_MS = 1 * 60 * 1000;

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

async function getSubscriptionsForUser(userId) {
  const result = await query(
    "SELECT id, sport_id, plan, method, started_at, expires_at FROM subscriptions WHERE user_id = $1 ORDER BY created_at ASC",
    [userId]
  );
  return result.rows.map(normalizeSubscriptionRow);
}

async function getHistoryForUser(userId) {
  const result = await query(
    `SELECT id, sport_id, plan, method, amount_rub, started_at, expires_at, created_at
     FROM subscription_history
     WHERE user_id = $1
     ORDER BY created_at DESC, id DESC`,
    [userId]
  );
  return result.rows.map(normalizeHistoryRow);
}

// Получить все подписки текущего пользователя
router.get("/", authMiddleware, async (req, res) => {
  try {
    const subscriptions = await getSubscriptionsForUser(req.user.id);
    return res.json({ subscriptions });
  } catch (err) {
    console.error("GET /api/subscriptions error:", err);
    return res.status(500).json({ error: "Ошибка сервера при получении подписок" });
  }
});

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const history = await getHistoryForUser(req.user.id);
    return res.json({ history });
  } catch (err) {
    console.error("GET /api/subscriptions/history error:", err);
    return res.status(500).json({ error: "Ошибка сервера при получении истории подписок" });
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
    // Храним реальный момент времени в UTC.
    // На фронте он уже форматируется как Europe/Moscow для отображения.
    const now = new Date();
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

    await query(
      `INSERT INTO subscription_history (user_id, sport_id, plan, method, amount_rub, started_at, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [req.user.id, sportId, plan, method, 0, now.toISOString(), expiresAt.toISOString()]
    );

    const [subscriptions, history] = await Promise.all([
      getSubscriptionsForUser(req.user.id),
      getHistoryForUser(req.user.id),
    ]);

    return res.json({ subscriptions, history });
  } catch (err) {
    console.error("POST /api/subscriptions/activate error:", err);
    return res.status(500).json({ error: "Ошибка сервера при активации подписки" });
  }
});

export default router;

