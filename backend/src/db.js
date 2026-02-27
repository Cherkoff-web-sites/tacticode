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
let connectionParams = null;

if (rawConnectionString) {
  try {
    const url = new URL(rawConnectionString);
    // Убираем параметры, которые могут конфликтовать с ssl-конфигом
    url.searchParams.delete("sslmode");
    url.searchParams.delete("rejectUnauthorized");

    connectionParams = {
      host: url.hostname,
      port: url.port ? Number(url.port) : 5432,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, "")
    };
  } catch (err) {
    console.warn("Invalid DATABASE_URL, using as-is:", err.message);
    connectionString = rawConnectionString;
  }
}

const sslConfig = sslInsecure ? { ssl: { rejectUnauthorized: false } } : {};

export const pool = new Pool(
  connectionParams
    ? {
        ...connectionParams,
        ...sslConfig
      }
    : connectionString
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

function logDbSslConfig() {
  if (process.env.NODE_ENV === "test") {
    return;
  }
  const ssl = pool?.options?.ssl || null;
  const safeOptions = {
    host: pool?.options?.host,
    port: pool?.options?.port,
    user: pool?.options?.user,
    database: pool?.options?.database,
    ssl
  };
  let safeUrl = connectionString;
  if (safeUrl) {
    try {
      const url = new URL(safeUrl);
      if (url.password) {
        url.password = "*****";
      }
      safeUrl = url.toString();
    } catch {
      // ignore malformed url
    }
  }
  console.log("DB connection string:", safeUrl || "<env>");
  console.log("DB SSL config:", ssl);
  console.log("DB pool options:", safeOptions);
}

logDbSslConfig();

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== "production") {
    console.log("executed query", { text, duration, rows: res.rowCount });
  }
  return res;
}

