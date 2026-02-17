import express from "express";
import { authMiddleware } from "./authRoutes.js";
import { query } from "./db.js";

const router = express.Router();
const MAX_DEVICES = 3;

router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await query(
      "SELECT id, device_name, device_type, created_at, last_active_at FROM devices WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    return res.json({ devices: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/register", authMiddleware, async (req, res) => {
  const { device_name, device_type } = req.body || {};

  if (!device_name || !device_type) {
    return res.status(400).json({ error: "device_name и device_type обязательны" });
  }

  try {
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
      "INSERT INTO devices (user_id, device_name, device_type) VALUES ($1, $2, $3) RETURNING id, device_name, device_type, created_at, last_active_at",
      [req.user.id, device_name, device_type]
    );

    return res.status(201).json({ device: result.rows[0] });
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
    const result = await query("DELETE FROM devices WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Устройство не найдено" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;

