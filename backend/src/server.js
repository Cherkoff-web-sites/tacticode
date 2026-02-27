import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./authRoutes.js";
import deviceRoutes from "./deviceRoutes.js";
import { query } from "./db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const dbDisabled = (process.env.DB_DISABLED || "").toLowerCase() === "true";

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

if (dbDisabled) {
  console.warn("DB_DISABLED=true — all /api routes (except /api/health) disabled");
  app.use("/api", (req, res) => {
    return res.status(503).json({ error: "База данных временно отключена" });
  });
}

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);

async function ensureSchema() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const initPath = path.join(__dirname, "..", "sql", "init.sql");
    const sql = fs.readFileSync(initPath, "utf8");
    await query(sql);
    console.log("Database schema ensured");
  } catch (err) {
    console.error("Failed to ensure schema (DB unavailable):", err.message);
    // Не завершаем процесс — контейнер поднимется, /api/health сработает
    // Добавьте DATABASE_URL и перезапустите
  }
}

const port = Number(process.env.PORT) || 4000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend listening on http://0.0.0.0:${port}`);
});

// Не блокируем запуск сервера, даже если БД временно недоступна
if (!dbDisabled) {
  ensureSchema();
}

