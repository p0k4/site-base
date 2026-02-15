import { db } from "../../src/config/db";

type TableRow = { tablename: string };

export const resetDb = async () => {
  const { rows } = await db.query<TableRow>(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
  );

  if (rows.length === 0) return;

  const tables = rows.map((row) => `"${row.tablename}"`).join(", ");
  await db.query(`TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE`);
};
