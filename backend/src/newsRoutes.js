import express from "express";
import { query } from "./db.js";
import { normalizeNewsProps } from "./newsSeed.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await query(
      `SELECT id, title, description, image_url, display_date, sort_order, is_published, created_at, updated_at
       FROM news
       WHERE is_published = TRUE
       ORDER BY sort_order DESC, id DESC`
    );
    return res.json({ news: result.rows.map(normalizeNewsProps) });
  } catch (err) {
    console.error("GET /api/news error:", err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
