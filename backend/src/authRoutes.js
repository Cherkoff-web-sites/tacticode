import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "./db.js";

const router = express.Router();

const TOKEN_TTL_HOURS = 24;

function signToken(user) {
  const payload = { id: user.id, login: user.login, email: user.email || null };
  return jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: `${TOKEN_TTL_HOURS}h`
  });
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }
  const token = authHeader.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Невалидный или истёкший токен" });
  }
}

router.post("/register", async (req, res) => {
  const { login, email, password } = req.body || {};

  if (!login || !password) {
    return res.status(400).json({ error: "Логин и пароль обязательны" });
  }

  try {
    const existing = await query(
      "SELECT id FROM users WHERE login = $1 OR (email IS NOT NULL AND email = $2)",
      [login, email || null]
    );
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: "Логин или почта уже заняты" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query(
      "INSERT INTO users (login, email, password_hash) VALUES ($1, $2, $3) RETURNING id, login, email, created_at",
      [login, email || null, passwordHash]
    );

    const user = result.rows[0];
    const token = signToken(user);

    return res.status(201).json({ user, accessToken: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body || {};

  if (!identifier || !password) {
    return res.status(400).json({ error: "Логин/почта и пароль обязательны" });
  }

  try {
    const result = await query(
      "SELECT id, login, email, password_hash FROM users WHERE login = $1 OR email = $1",
      [identifier]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Неверный логин/почта или пароль" });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Неверный логин/почта или пароль" });
    }

    const token = signToken(user);
    delete user.password_hash;

    return res.json({ user, accessToken: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await query(
      "SELECT id, login, email, created_at, updated_at FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.patch("/me", authMiddleware, async (req, res) => {
  const { login, email } = req.body || {};

  if (!login && !email) {
    return res.status(400).json({ error: "Нечего обновлять" });
  }

  try {
    if (login || email) {
      const check = await query(
        "SELECT id FROM users WHERE id <> $1 AND (login = COALESCE($2, login) OR (email IS NOT NULL AND email = COALESCE($3, email)))",
        [req.user.id, login || null, email || null]
      );
      if (check.rowCount > 0) {
        return res.status(409).json({ error: "Такой логин или почта уже используются" });
      }
    }

    const result = await query(
      "UPDATE users SET login = COALESCE($2, login), email = COALESCE($3, email), updated_at = NOW() WHERE id = $1 RETURNING id, login, email, created_at, updated_at",
      [req.user.id, login || null, email || null]
    );

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;

