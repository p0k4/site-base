import { db } from "../config/db";

export const createContacto = async (data: {
  name: string;
  email: string;
  contact: string;
  message: string;
}) => {
  const result = await db.query(
    `
    INSERT INTO contactos (name, email, contact, message)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [data.name, data.email, data.contact, data.message]
  );
  return result.rows[0];
};
