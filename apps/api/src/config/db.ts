import { Pool } from "pg";
import { env } from "./env";

const pool = new Pool(
  env.databaseUrl
    ? { connectionString: env.databaseUrl }
    : {
        host: env.dbHost,
        port: env.dbPort,
        user: env.dbUser,
        password: env.dbPassword,
        database: env.dbName
      }
);

export const db = {
  query: <T = unknown>(text: string, params?: unknown[]) => pool.query<T>(text, params),
  getClient: () => pool.connect(),
  end: () => pool.end()
};

export type DbClient = Awaited<ReturnType<typeof pool.connect>>;
