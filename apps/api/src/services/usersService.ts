import { db } from "../config/db";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  location: string | null;
  role: string;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
};

export const createUser = async (data: {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  location?: string | null;
  role?: string;
}) => {
  const result = await db.query<UserRecord>(
    `
    INSERT INTO users (name, email, password_hash, phone, location, role)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [data.name, data.email, data.passwordHash, data.phone || null, data.location || null, data.role || "user"]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await db.query<UserRecord>("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

export const findUserById = async (id: string) => {
  const result = await db.query<UserRecord>("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const updateUserProfile = async (id: string, fields: {
  name?: string;
  phone?: string | null;
  location?: string | null;
}) => {
  const result = await db.query<UserRecord>(
    `
    UPDATE users
    SET name = COALESCE($2, name),
        phone = COALESCE($3, phone),
        location = COALESCE($4, location),
        updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [id, fields.name ?? null, fields.phone ?? null, fields.location ?? null]
  );
  return result.rows[0];
};

export const listUsers = async () => {
  const result = await db.query<UserRecord>(
    "SELECT id, name, email, phone, location, role, is_blocked, created_at, updated_at FROM users ORDER BY created_at DESC"
  );
  return result.rows;
};

export const setUserBlocked = async (id: string, blocked: boolean) => {
  const result = await db.query<UserRecord>(
    "UPDATE users SET is_blocked = $2, updated_at = NOW() WHERE id = $1 RETURNING *",
    [id, blocked]
  );
  return result.rows[0];
};
