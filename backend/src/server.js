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

console.log("------------------- APP START -------------------");
console.log("ENV PORT:", process.env.PORT || "<default 4000>");
console.log("ENV DB_DISABLED:", process.env.DB_DISABLED || "<not set>");

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  const stamp = new Date().toISOString();
  console.log(`[${stamp}] Incoming request: ${req.method} ${req.url}`);
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] Response: ${req.method} ${req.url} -> ${res.statusCode} (${ms}ms)`
    );
  });
  next();
});

const dbDisabled = (process.env.DB_DISABLED || "").toLowerCase() === "true";

app.get("/api/health", (req, res) => {
  res.sendStatus(200);
});

console.log("Health endpoint: /api/health");

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

