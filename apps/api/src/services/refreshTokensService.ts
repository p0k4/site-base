import { db } from "../config/db";

export type RefreshTokenRecord = {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
};

export const saveRefreshToken = async (data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) => {
  const result = await db.query<RefreshTokenRecord>(
    `
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [data.userId, data.tokenHash, data.expiresAt]
  );
  return result.rows[0];
};

export const getActiveRefreshTokens = async (userId: string) => {
  const result = await db.query<RefreshTokenRecord>(
    `
    SELECT * FROM refresh_tokens
    WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > NOW()
    ORDER BY created_at DESC
    `,
    [userId]
  );
  return result.rows;
};

export const revokeRefreshToken = async (id: string) => {
  await db.query("UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1", [id]);
};

export const revokeAllRefreshTokens = async (userId: string) => {
  await db.query("UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL", [userId]);
};
