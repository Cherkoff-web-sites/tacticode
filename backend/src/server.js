import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./authRoutes.js";
import deviceRoutes from "./deviceRoutes.js";
import { query } from "./db.js";
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

console.log("------------------- APP START 33 -------------------");
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDir = path.join(__dirname, "..", "public");
app.use(express.static(staticDir));
console.log("Static files dir:", staticDir);

app.get("/api/health", (req, res) => {
  res.sendStatus(200);
});

console.log("Health endpoint: /api/health");

function logSelfHealthcheck() {
  try {
    const start = Date.now();
    const req = http.request(
      "http://127.0.0.1:4000/api/health",
      { method: "GET", timeout: 3000 },
      (res) => {
        if (res.statusCode !== 200) {
          const ms = Date.now() - start;
          console.warn(
            `[${new Date().toISOString()}] Self-healthcheck warning: ${res.statusCode} (${ms}ms)`
          );
        }
        res.resume();
      }
    );
    req.on("timeout", () => {
      req.destroy(new Error("Self-healthcheck timeout"));
    });
    req.on("error", (err) => {
      console.log(
        `[${new Date().toISOString()}] Self-healthcheck error: ${err.message}`
      );
    });
    req.end();
  } catch (err) {
    console.log(
      `[${new Date().toISOString()}] Self-healthcheck setup error: ${err.message}`
    );
  }
}

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
  setInterval(logSelfHealthcheck, 10000);
});

// Не блокируем запуск сервера, даже если БД временно недоступна
if (!dbDisabled) {
  ensureSchema();
}

