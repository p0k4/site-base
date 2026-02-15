import { db } from "../config/db";

export type ServiceRecord = {
  id: string;
  name: string;
  description: string;
  price: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const listServices = async () => {
  const result = await db.query<ServiceRecord>(
    "SELECT * FROM services WHERE is_active = true ORDER BY created_at DESC"
  );
  return result.rows;
};

export const listAdminServices = async () => {
  const result = await db.query<ServiceRecord>(
    "SELECT * FROM services ORDER BY created_at DESC"
  );
  return result.rows;
};

export const createService = async (data: {
  name: string;
  description: string;
  price?: number | null;
  isActive?: boolean;
}) => {
  const result = await db.query<ServiceRecord>(
    `
    INSERT INTO services (name, description, price, is_active)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [data.name, data.description, data.price ?? null, data.isActive ?? true]
  );
  return result.rows[0];
};

export const updateService = async (id: string, data: Partial<{ name: string; description: string; price: number | null; isActive: boolean }>) => {
  const result = await db.query<ServiceRecord>(
    `
    UPDATE services
    SET name = COALESCE($2, name),
        description = COALESCE($3, description),
        price = COALESCE($4, price),
        is_active = COALESCE($5, is_active),
        updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [id, data.name ?? null, data.description ?? null, data.price ?? null, data.isActive ?? null]
  );
  return result.rows[0];
};

export const deleteService = async (id: string) => {
  await db.query("DELETE FROM services WHERE id = $1", [id]);
};
