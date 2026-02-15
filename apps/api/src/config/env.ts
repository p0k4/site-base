import dotenv from "dotenv";
import path from "path";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const parseCorsOrigins = (value: string | undefined, fallback: string) => {
  if (!value) return fallback;
  const origins = value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (origins.length === 0) return fallback;
  return origins.length === 1 ? origins[0] : origins;
};

const required = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

required.forEach((key) => {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.warn(`[env] Missing ${key}. Set it in .env for production.`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || "",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT || 5432),
  dbUser: process.env.DB_USER || "app_user",
  dbPassword: process.env.DB_PASSWORD || "app_password",
  dbName: process.env.DB_NAME || "app_db",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "dev_access_secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev_refresh_secret",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  corsOrigin: parseCorsOrigins(process.env.CORS_ORIGIN, "http://localhost:5174"),
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  uploadMaxFileSizeMb: Number(process.env.UPLOAD_MAX_FILE_SIZE_MB || 5),
  uploadMaxFiles: Number(process.env.UPLOAD_MAX_FILES || 12)
};
