import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const rawConnectionString = process.env.DATABASE_URL;
const sslInsecure =
  (process.env.DB_SSL_INSECURE || process.env.PGSSL_INSECURE || "").toLowerCase() ===
    "true" ||
  (process.env.NODE_ENV === "production" &&
    (process.env.DB_SSL_INSECURE || "").toLowerCase() !== "false");

let connectionString = rawConnectionString;

if (rawConnectionString && sslInsecure) {
  try {
    const url = new URL(rawConnectionString);
    if (!url.searchParams.get("sslmode")) {
      url.searchParams.set("sslmode", "require");
    }
    if (!url.searchParams.get("rejectUnauthorized")) {
      url.searchParams.set("rejectUnauthorized", "false");
    }
    connectionString = url.toString();
  } catch (err) {
    console.warn("Invalid DATABASE_URL, using as-is:", err.message);
    connectionString = rawConnectionString;
  }
}

const sslRequired =
  connectionString &&
  /sslmode=(verify-full|require)/i.test(connectionString);
const sslConfig =
  connectionString && (sslRequired || sslInsecure)
    ? { ssl: { rejectUnauthorized: false } }
    : {};

export const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ...sslConfig
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME || "tacticode"
      }
);

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== "production") {
    console.log("executed query", { text, duration, rows: res.rowCount });
  }
  return res;
}

