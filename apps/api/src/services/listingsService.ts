import { db } from "../config/db";

export type ListingRecord = {
  id: string;
  user_id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: string;
  fuel_type: string;
  transmission: string;
  mileage: number;
  location: string;
  description: string;
  source_type: string;
  source_name: string | null;
  external_url: string | null;
  external_ref: string | null;
  cover_image_url?: string | null;
  status: string;
  is_approved: boolean;
  is_featured: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ListingImageRecord = {
  id: string;
  listing_id: string;
  url: string;
  sort_order: number;
  created_at: string;
};

export const createListing = async (data: {
  userId: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  location: string;
  description: string;
  status?: string;
  sourceType?: "internal" | "external";
  sourceName?: string | null;
  externalUrl?: string | null;
  externalRef?: string | null;
}) => {
  const result = await db.query<ListingRecord>(
    `
    INSERT INTO listings
      (user_id, title, brand, model, year, price, fuel_type, transmission, mileage, location, description, status, source_type, source_name, external_url, external_ref)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    RETURNING *
    `,
    [
      data.userId,
      data.title,
      data.brand,
      data.model,
      data.year,
      data.price,
      data.fuelType,
      data.transmission,
      data.mileage,
      data.location,
      data.description,
      data.status || "active",
      data.sourceType || "internal",
      data.sourceName ?? null,
      data.externalUrl ?? null,
      data.externalRef ?? null
    ]
  );
  return result.rows[0];
};

export const updateListing = async (id: string, userId: string, fields: Partial<{
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  location: string;
  description: string;
  status: string;
  sourceType: "internal" | "external";
  sourceName: string | null;
  externalUrl: string | null;
  externalRef: string | null;
}>) => {
  const result = await db.query<ListingRecord>(
    `
    UPDATE listings
    SET title = COALESCE($3, title),
        brand = COALESCE($4, brand),
        model = COALESCE($5, model),
        year = COALESCE($6, year),
        price = COALESCE($7, price),
        fuel_type = COALESCE($8, fuel_type),
        transmission = COALESCE($9, transmission),
        mileage = COALESCE($10, mileage),
        location = COALESCE($11, location),
        description = COALESCE($12, description),
        status = COALESCE($13, status),
        source_type = COALESCE($14, source_type),
        source_name = COALESCE($15, source_name),
        external_url = COALESCE($16, external_url),
        external_ref = COALESCE($17, external_ref),
        updated_at = NOW()
    WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
    RETURNING *
    `,
    [
      id,
      userId,
      fields.title ?? null,
      fields.brand ?? null,
      fields.model ?? null,
      fields.year ?? null,
      fields.price ?? null,
      fields.fuelType ?? null,
      fields.transmission ?? null,
      fields.mileage ?? null,
      fields.location ?? null,
      fields.description ?? null,
      fields.status ?? null,
      fields.sourceType ?? null,
      fields.sourceName ?? null,
      fields.externalUrl ?? null,
      fields.externalRef ?? null
    ]
  );
  return result.rows[0];
};

export const setListingStatus = async (id: string, userId: string, status: string) => {
  const result = await db.query<ListingRecord>(
    `
    UPDATE listings
    SET status = $3, updated_at = NOW()
    WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
    RETURNING *
    `,
    [id, userId, status]
  );
  return result.rows[0];
};

export const setListingStatusAdmin = async (id: string, status: string) => {
  const result = await db.query<ListingRecord>(
    `
    UPDATE listings
    SET status = $2, updated_at = NOW()
    WHERE id = $1 AND deleted_at IS NULL
    RETURNING *
    `,
    [id, status]
  );
  return result.rows[0];
};

export const softDeleteListing = async (id: string, userId: string) => {
  const result = await db.query<ListingRecord>(
    `
    UPDATE listings
    SET deleted_at = NOW(), updated_at = NOW()
    WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
    RETURNING *
    `,
    [id, userId]
  );
  return result.rows[0];
};

export const getListingById = async (id: string, options?: { includeUnapproved?: boolean; includeDeleted?: boolean }) => {
  const conditions = ["id = $1"];
  const params: unknown[] = [id];

  if (!options?.includeDeleted) {
    conditions.push("deleted_at IS NULL");
  }

  if (!options?.includeUnapproved) {
    conditions.push("is_approved = true");
  }

  const result = await db.query<ListingRecord>(
    `SELECT * FROM listings WHERE ${conditions.join(" AND ")}`,
    params
  );
  return result.rows[0];
};

export const listListingsByUser = async (userId: string) => {
  const result = await db.query<ListingRecord>(
    `SELECT * FROM listings WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const getListingOwnedByUser = async (id: string, userId: string) => {
  const result = await db.query<ListingRecord>(
    `SELECT * FROM listings WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [id, userId]
  );
  return result.rows[0];
};

export const listAdminListings = async () => {
  const result = await db.query<ListingRecord>(
    `SELECT * FROM listings WHERE deleted_at IS NULL ORDER BY created_at DESC`
  );
  return result.rows;
};

export const approveListing = async (id: string, approved: boolean) => {
  const result = await db.query<ListingRecord>(
    `UPDATE listings SET is_approved = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id, approved]
  );
  return result.rows[0];
};

export const listPublicListings = async (filters: {
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  fuelType?: string;
  transmission?: string;
  mileageMax?: number;
  location?: string;
  page?: number;
  limit?: number;
}) => {
  const conditions: string[] = ["is_approved = true", "status = 'active'", "deleted_at IS NULL"];
  const values: unknown[] = [];

  const add = (sql: string, value: unknown) => {
    values.push(value);
    conditions.push(sql.replace("$", `$${values.length}`));
  };

  if (filters.brand) add("brand ILIKE $", `%${filters.brand}%`);
  if (filters.model) add("model ILIKE $", `%${filters.model}%`);
  if (filters.yearMin) add("year >= $", filters.yearMin);
  if (filters.yearMax) add("year <= $", filters.yearMax);
  if (filters.priceMin) add("price >= $", filters.priceMin);
  if (filters.priceMax) add("price <= $", filters.priceMax);
  if (filters.fuelType) add("fuel_type = $", filters.fuelType);
  if (filters.transmission) add("transmission = $", filters.transmission);
  if (filters.mileageMax) add("mileage <= $", filters.mileageMax);
  if (filters.location) add("location ILIKE $", `%${filters.location}%`);

  const limit = Math.min(filters.limit || 12, 50);
  const page = Math.max(filters.page || 1, 1);
  const offset = (page - 1) * limit;

  values.push(limit, offset);

  const result = await db.query<ListingRecord>(
    `
    SELECT
      listings.*,
      (
        SELECT url
        FROM listing_images
        WHERE listing_id = listings.id
        ORDER BY sort_order ASC
        LIMIT 1
      ) AS cover_image_url
    FROM listings
    WHERE ${conditions.join(" AND ")}
    ORDER BY created_at DESC
    LIMIT $${values.length - 1} OFFSET $${values.length}
    `,
    values
  );

  return result.rows;
};

export const addListingImages = async (listingId: string, imageUrls: string[]) => {
  if (!imageUrls.length) return [] as ListingImageRecord[];
  const existing = await db.query<{ max: number | null }>(
    "SELECT COALESCE(MAX(sort_order), 0) AS max FROM listing_images WHERE listing_id = $1",
    [listingId]
  );
  const baseOrder = existing.rows[0]?.max || 0;
  const values: unknown[] = [];
  const placeholders = imageUrls.map((url, index) => {
    const order = baseOrder + index + 1;
    values.push(listingId, url, order);
    const offset = index * 3;
    return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
  });

  const result = await db.query<ListingImageRecord>(
    `
    INSERT INTO listing_images (listing_id, url, sort_order)
    VALUES ${placeholders.join(", ")}
    RETURNING *
    `,
    values
  );

  return result.rows;
};

export const listListingImages = async (listingId: string) => {
  const result = await db.query<ListingImageRecord>(
    `SELECT * FROM listing_images WHERE listing_id = $1 ORDER BY sort_order ASC`,
    [listingId]
  );
  return result.rows;
};

export const getListingImageById = async (listingId: string, imageId: string) => {
  const result = await db.query<ListingImageRecord>(
    `SELECT * FROM listing_images WHERE id = $1 AND listing_id = $2`,
    [imageId, listingId]
  );
  return result.rows[0];
};

export const deleteListingImage = async (listingId: string, imageId: string) => {
  const result = await db.query<ListingImageRecord>(
    `DELETE FROM listing_images WHERE id = $1 AND listing_id = $2 RETURNING *`,
    [imageId, listingId]
  );
  return result.rows[0];
};

export const updateListingImageOrder = async (listingId: string, orders: { id: string; sortOrder: number }[]) => {
  const client = await db.getClient();
  try {
    await client.query("BEGIN");
    for (const item of orders) {
      await client.query(
        "UPDATE listing_images SET sort_order = $3 WHERE id = $1 AND listing_id = $2",
        [item.id, listingId, item.sortOrder]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
