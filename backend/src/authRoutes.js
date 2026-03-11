import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "./db.js";
import { sendCodeEmail } from "./mailer.js";

const router = express.Router();

const TOKEN_TTL_HOURS = 24;
const CODE_TTL_MINUTES = 10;

function signToken(user) {
  const payload = { id: user.id, login: user.login, email: user.email || null };
  return jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: `${TOKEN_TTL_HOURS}h`
  });
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function normalizeUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    login: row.login,
    email: row.email || null,
    registeredAt: row.registered_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
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
      "INSERT INTO users (login, email, password_hash) VALUES ($1, $2, $3) RETURNING id, login, email, registered_at, created_at, updated_at",
      [login, email || null, passwordHash]
    );

    const user = normalizeUserRow(result.rows[0]);
    const token = signToken(user);

    return res.status(201).json({ user, accessToken: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/register/request-code", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Почта и пароль обязательны" });
  }

  const trimmedEmail = String(email).trim().toLowerCase();

  try {
    const existing = await query(
      "SELECT id FROM users WHERE email = $1",
      [trimmedEmail]
    );
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: "Аккаунт с такой почтой уже существует" });
    }

    const code = generateCode();
    const passwordHash = await bcrypt.hash(password, 10);

    await query(
      "INSERT INTO auth_codes (email, code, purpose, login, password_hash, expires_at) VALUES ($1, $2, 'register', $3, $4, NOW() + ($5 || ' minutes')::INTERVAL)",
      [trimmedEmail, code, trimmedEmail, passwordHash, CODE_TTL_MINUTES]
    );

    await sendCodeEmail(trimmedEmail, "Код подтверждения регистрации Tacticode", code);

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/register/confirm", async (req, res) => {
  const { email, code } = req.body || {};

  if (!email || !code) {
    return res.status(400).json({ error: "Почта и код обязательны" });
  }

  const trimmedEmail = String(email).trim().toLowerCase();
  const trimmedCode = String(code).trim();

  try {
    const codeResult = await query(
      "SELECT id, login, password_hash FROM auth_codes WHERE email = $1 AND code = $2 AND purpose = 'register' AND expires_at > NOW() AND used_at IS NULL ORDER BY created_at DESC LIMIT 1",
      [trimmedEmail, trimmedCode]
    );

    if (codeResult.rowCount === 0) {
      return res.status(400).json({ error: "Неверный код" });
    }

    const codeRow = codeResult.rows[0];

    const existing = await query(
      "SELECT id FROM users WHERE email = $1",
      [trimmedEmail]
    );
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: "Аккаунт с такой почтой уже существует" });
    }

    const result = await query(
      "INSERT INTO users (login, email, password_hash) VALUES ($1, $2, $3) RETURNING id, login, email, registered_at, created_at, updated_at",
      [codeRow.login || trimmedEmail, trimmedEmail, codeRow.password_hash]
    );

    await query(
      "UPDATE auth_codes SET used_at = NOW() WHERE id = $1",
      [codeRow.id]
    );

    const user = normalizeUserRow(result.rows[0]);
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
      "SELECT id, login, email, password_hash, registered_at, created_at, updated_at FROM users WHERE login = $1 OR email = $1",
      [identifier]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Неверный логин/почта или пароль" });
    }

    const userRow = result.rows[0];
    const ok = await bcrypt.compare(password, userRow.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Неверный логин/почта или пароль" });
    }

    const user = normalizeUserRow(userRow);
    const token = signToken(user);

    return res.json({ user, accessToken: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/password/request-reset", async (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: "Почта обязательна" });
  }

  const trimmedEmail = String(email).trim().toLowerCase();

  try {
    const userResult = await query(
      "SELECT id FROM users WHERE email = $1",
      [trimmedEmail]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        error: "К указанной почте не привязан ни один аккаунт. Проверьте правильность написания"
      });
    }

    const code = generateCode();

    await query(
      "INSERT INTO auth_codes (email, code, purpose, expires_at) VALUES ($1, $2, 'reset', NOW() + ($3 || ' minutes')::INTERVAL)",
      [trimmedEmail, code, CODE_TTL_MINUTES]
    );

    await sendCodeEmail(trimmedEmail, "Код для восстановления доступа Tacticode", code);

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/password/verify-code", async (req, res) => {
  const { email, code } = req.body || {};

  if (!email || !code) {
    return res.status(400).json({ error: "Почта и код обязательны" });
  }

  const trimmedEmail = String(email).trim().toLowerCase();
  const trimmedCode = String(code).trim();

  try {
    const codeResult = await query(
      "SELECT id FROM auth_codes WHERE email = $1 AND code = $2 AND purpose = 'reset' AND expires_at > NOW() AND used_at IS NULL ORDER BY created_at DESC LIMIT 1",
      [trimmedEmail, trimmedCode]
    );

    if (codeResult.rowCount === 0) {
      return res.status(400).json({ error: "Неверный код" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/password/reset", async (req, res) => {
  const { email, code, password } = req.body || {};

  if (!email || !code || !password) {
    return res.status(400).json({ error: "Почта, код и новый пароль обязательны" });
  }

  const trimmedEmail = String(email).trim().toLowerCase();
  const trimmedCode = String(code).trim();

  try {
    const codeResult = await query(
      "SELECT id FROM auth_codes WHERE email = $1 AND code = $2 AND purpose = 'reset' AND expires_at > NOW() AND used_at IS NULL ORDER BY created_at DESC LIMIT 1",
      [trimmedEmail, trimmedCode]
    );

    if (codeResult.rowCount === 0) {
      return res.status(400).json({ error: "Неверный код" });
    }

    const userResult = await query(
      "SELECT id, login, email FROM users WHERE email = $1",
      [trimmedEmail]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const updatedUser = await query(
      "UPDATE users SET password_hash = $2, updated_at = NOW() WHERE email = $1 RETURNING id, login, email, registered_at, created_at, updated_at",
      [trimmedEmail, passwordHash]
    );

    await query(
      "UPDATE auth_codes SET used_at = NOW() WHERE id = $1",
      [codeResult.rows[0].id]
    );

    const user = normalizeUserRow(updatedUser.rows[0]);
    const token = signToken(user);

    return res.json({ user, accessToken: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await query(
      "SELECT id, login, email, registered_at, created_at, updated_at FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    return res.json({ user: normalizeUserRow(result.rows[0]) });
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
      "UPDATE users SET login = COALESCE($2, login), email = COALESCE($3, email), updated_at = NOW() WHERE id = $1 RETURNING id, login, email, registered_at, created_at, updated_at",
      [req.user.id, login || null, email || null]
    );

    return res.json({ user: normalizeUserRow(result.rows[0]) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.patch("/me/password", authMiddleware, async (req, res) => {
  const { password } = req.body || {};

  if (!password || !String(password).trim()) {
    return res.status(400).json({ error: "Новый пароль обязателен" });
  }

  try {
    const passwordHash = await bcrypt.hash(String(password), 10);
    const result = await query(
      "UPDATE users SET password_hash = $2, updated_at = NOW() WHERE id = $1 RETURNING id, login, email, registered_at, created_at, updated_at",
      [req.user.id, passwordHash]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    return res.json({ user: normalizeUserRow(result.rows[0]) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;

