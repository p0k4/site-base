import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import listingRoutes from "./routes/listings";
import serviceRoutes from "./routes/services";
import leadRoutes from "./routes/leads";
import contactoRoutes from "./routes/contactos";
import adminRoutes from "./routes/admin";
import settingsRoutes from "./routes/settings";
import companyRoutes from "./routes/company";
import { env } from "./config/env";
import { db } from "./config/db";
import { ensureDir } from "./utils/files";
import { errorHandler, notFound } from "./middleware/error";

const app = express();

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_DIR || "uploads";
const uploadPath = path.isAbsolute(uploadDir) ? uploadDir : path.resolve(process.cwd(), uploadDir);
ensureDir(uploadPath);
// eslint-disable-next-line no-console
console.log("[uploads] serving from:", uploadPath);
app.use("/uploads", (_req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use("/uploads", express.static(uploadPath));

app.get("/health", async (_req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: "unknown"
  };

  try {
    // Check database connectivity
    const result = await db.query("SELECT NOW() as time");
    health.database = result.rows[0] ? "connected" : "disconnected";
    res.status(200).json(health);
  } catch (error) {
    health.status = "degraded";
    health.database = "disconnected";
    res.status(503).json(health);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/contactos", contactoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/company", companyRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
