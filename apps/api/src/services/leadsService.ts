import { db } from "../config/db";

export type ServiceLeadRecord = {
  id: string;
  service_id: string | null;
  service_name: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
};

export type PurchaseLeadRecord = {
  id: string;
  listing_id: string | null;
  listing_title: string | null;
  listing_brand: string | null;
  listing_model: string | null;
  cover_url: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
};

export const createLead = async (data: {
  userId?: string | null;
  listingId?: string | null;
  serviceId?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}) => {
  const result = await db.query(
    `
    INSERT INTO leads_contacts (user_id, listing_id, service_id, name, email, phone, message)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      data.userId || null,
      data.listingId || null,
      data.serviceId || null,
      data.name,
      data.email,
      data.phone || null,
      data.message
    ]
  );
  return result.rows[0];
};

export const listServiceLeads = async () => {
  const result = await db.query<ServiceLeadRecord>(
    `
    SELECT
      leads.id,
      leads.service_id,
      services.name AS service_name,
      leads.name,
      leads.email,
      leads.phone,
      leads.message,
      leads.created_at
    FROM leads_contacts AS leads
    LEFT JOIN services ON services.id = leads.service_id
    WHERE leads.service_id IS NOT NULL
    ORDER BY leads.created_at DESC
    `
  );

  return result.rows;
};

export const listPurchaseLeads = async () => {
  const result = await db.query<PurchaseLeadRecord>(
    `
    SELECT
      leads.id,
      leads.listing_id,
      listings.title AS listing_title,
      listings.brand AS listing_brand,
      listings.model AS listing_model,
      cover.url AS cover_url,
      leads.name,
      leads.email,
      leads.phone,
      leads.message,
      leads.created_at
    FROM leads_contacts AS leads
    LEFT JOIN car_listings AS listings ON listings.id = leads.listing_id
    LEFT JOIN LATERAL (
      SELECT listing_images.url
      FROM listing_images
      WHERE listing_images.listing_id = leads.listing_id
      ORDER BY listing_images.sort_order ASC, listing_images.created_at ASC
      LIMIT 1
    ) AS cover ON true
    WHERE leads.listing_id IS NOT NULL
    ORDER BY leads.created_at DESC
    `
  );

  return result.rows;
};
