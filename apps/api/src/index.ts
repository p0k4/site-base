import app from "./app";
import { env } from "./config/env";
import { db } from "./config/db";

const start = async () => {
  try {
    await db.query("SELECT 1");
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`[api] API running on :${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[api] Failed to connect to DB", error);
    process.exit(1);
  }
};

start();
