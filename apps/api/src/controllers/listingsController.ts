import { Response, Request } from "express";
import path from "path";
import { promises as fs } from "fs";
import { AuthedRequest } from "../middleware/auth";
import { db } from "../config/db";
import {
  addListingImages,
  approveListing,
  createListing,
  deleteListingImage,
  getListingById,
  getListingOwnedByUser,
  getListingImageById,
  listAdminListings,
  listListingImages,
  listListingsByUser,
  listPublicListings,
  setListingStatus,
  setListingStatusAdmin,
  softDeleteListing,
  updateListing,
  updateListingImageOrder
} from "../services/listingsService";
import { getStandvirtualSourceName, normalizeStandvirtualUrl } from "../utils/externalSources";
import { env } from "../config/env";

const uploadRoot = path.isAbsolute(env.uploadDir) ? env.uploadDir : path.resolve(process.cwd(), env.uploadDir);
const uploadRootNormalized = uploadRoot.replace(/\\/g, "/").replace(/\/+$/, "");

const normalizeUploadUrl = (url?: string | null) => {
  if (!url) return url ?? "";
  if (url.startsWith("/uploads/")) return url;
  const normalized = url.replace(/\\/g, "/");
  if (normalized.startsWith(uploadRootNormalized)) {
    const relative = normalized.slice(uploadRootNormalized.length).replace(/^\/+/, "");
    return `/uploads/${relative}`;
  }
  return url;
};

const toPublicUploadUrl = (filePath: string) => {
  const normalized = filePath.replace(/\\/g, "/");
  const absolutePath = path.isAbsolute(normalized) ? normalized : path.resolve(process.cwd(), normalized);
  const relativePath = path.relative(uploadRoot, absolutePath).replace(/\\/g, "/");
  const safeRelative = relativePath.replace(/^\/+/, "");
  if (safeRelative.startsWith("..")) {
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
  }
  return `/uploads/${safeRelative}`;
};

const withFilename = (images: Awaited<ReturnType<typeof listListingImages>>) =>
  images.map((image) => {
    const normalizedUrl = normalizeUploadUrl(image.url);
    return {
      ...image,
      url: normalizedUrl,
      filename: path.basename(normalizedUrl || image.url || "")
    };
  });

const resolveUploadPath = (url: string) => {
  if (!url) return null;
  const normalized = url.replace(/\\/g, "/");
  if (normalized.startsWith("/uploads/")) {
    const relative = normalized.replace(/^\/uploads\/?/, "");
    return path.join(uploadRoot, relative);
  }
  const absolute = path.isAbsolute(normalized) ? normalized : path.resolve(process.cwd(), normalized);
  if (!absolute.startsWith(uploadRoot)) return null;
  return absolute;
};

export const listPublic = async (req: Request, res: Response) => {
  const { brand, model, yearMin, yearMax, priceMin, priceMax, fuelType, transmission, mileageMax, location, page, limit } = req.query;

  const listings = await listPublicListings({
    brand: brand as string | undefined,
    model: model as string | undefined,
    yearMin: yearMin ? Number(yearMin) : undefined,
    yearMax: yearMax ? Number(yearMax) : undefined,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    fuelType: fuelType as string | undefined,
    transmission: transmission as string | undefined,
    mileageMax: mileageMax ? Number(mileageMax) : undefined,
    location: location as string | undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined
  });

  const normalized = listings.map((listing) => ({
    ...listing,
    cover_image_url: normalizeUploadUrl(listing.cover_image_url)
  }));

  return res.json(normalized);
};

export const getPublicById = async (req: Request, res: Response) => {
  const listing = await getListingById(req.params.id);
  if (!listing) {
    return res.status(404).json({ message: "Anuncio nao encontrado." });
  }
  const images = await listListingImages(listing.id);
  return res.json({ ...listing, images: withFilename(images) });
};

export const listMine = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const listings = await listListingsByUser(req.user.id);
  return res.json(listings);
};

export const create = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const rawExternalUrl = req.body.external_url ?? req.body.externalUrl;
  const sourceType = (req.body.source_type ?? req.body.sourceType ?? (rawExternalUrl ? "external" : "internal")) as
    | "internal"
    | "external";
  const sourceName = req.body.source_name ?? req.body.sourceName ?? (sourceType === "external" ? getStandvirtualSourceName() : null);
  const externalRef = req.body.external_ref ?? req.body.externalRef ?? null;
  let externalUrl: string | null = null;

  if (rawExternalUrl) {
    try {
      externalUrl = normalizeStandvirtualUrl(String(rawExternalUrl));
    } catch (error: any) {
      return res.status(400).json({ message: error?.message || "Link do Standvirtual invalido." });
    }
  }

  if (sourceType === "external" && !externalUrl) {
    return res.status(400).json({ message: "Link do Standvirtual obrigatorio para anuncios externos." });
  }

  const listing = await createListing({
    userId: req.user.id,
    title: req.body.title,
    brand: req.body.brand,
    model: req.body.model,
    year: req.body.year,
    price: req.body.price,
    fuelType: req.body.fuelType,
    transmission: req.body.transmission,
    mileage: req.body.mileage,
    location: req.body.location,
    description: req.body.description,
    status: req.body.status,
    sourceType,
    sourceName,
    externalUrl,
    externalRef
  });
  return res.status(201).json(listing);
};

export const getMineById = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const listing = req.user.role === "admin"
    ? await getListingById(req.params.id, { includeUnapproved: true, includeDeleted: false })
    : await getListingOwnedByUser(req.params.id, req.user.id);

  if (!listing) {
    return res.status(404).json({ message: "Anuncio nao encontrado." });
  }

  const images = await listListingImages(listing.id);
  return res.json({ ...listing, images: withFilename(images) });
};

export const update = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const payload = { ...req.body } as any;
  if (payload.source_type && !payload.sourceType) payload.sourceType = payload.source_type;
  if (payload.source_name && !payload.sourceName) payload.sourceName = payload.source_name;
  if (payload.external_ref && !payload.externalRef) payload.externalRef = payload.external_ref;
  if (payload.external_url && !payload.externalUrl) payload.externalUrl = payload.external_url;

  if (payload.externalUrl) {
    try {
      payload.externalUrl = normalizeStandvirtualUrl(String(payload.externalUrl));
    } catch (error: any) {
      return res.status(400).json({ message: error?.message || "Link do Standvirtual invalido." });
    }
  }

  const listing = await updateListing(req.params.id, req.user.id, payload);
  if (!listing) {
    return res.status(404).json({ message: "Anuncio nao encontrado." });
  }
  return res.json(listing);
};

export const importLink = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const rawExternalUrl = req.body.external_url ?? req.body.externalUrl;
  if (!rawExternalUrl) {
    return res.status(400).json({ message: "Link do Standvirtual obrigatorio." });
  }

  try {
    const normalizedUrl = normalizeStandvirtualUrl(String(rawExternalUrl));
    return res.json({
      normalized_url: normalizedUrl,
      source_type: "external",
      source_name: getStandvirtualSourceName()
    });
  } catch (error: any) {
    return res.status(400).json({ message: error?.message || "Link do Standvirtual invalido." });
  }
};

export const updateStatus = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const current = await getListingOwnedByUser(req.params.id, req.user.id);
  if (!current) {
    return res.status(404).json({ message: "Anuncio nao encontrado." });
  }
  if (current.status === "suspended") {
    return res.status(400).json({ message: "Apenas admin pode reativar um anuncio suspenso." });
  }

  const listing = await setListingStatus(req.params.id, req.user.id, req.body.status);
  return res.json(listing);
};

export const suspendListing = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const listing = await getListingById(req.params.id, { includeUnapproved: true, includeDeleted: false });
  if (!listing) {
    return res.status(404).json({ message: "Anuncio nao encontrado." });
  }

  if (!listing.is_approved) {
    return res.status(400).json({ message: "Apenas anuncios aprovados podem ser suspensos." });
  }

  if (listing.status !== "active") {
    return res.status(400).json({ message: "So anuncios ativos podem ser suspensos." });
  }

  const updated = await setListingStatusAdmin(listing.id, "suspended");
  return res.json(updated);
};

export const activateListing = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const listing = await getListingById(req.params.id, { includeUnapproved: true, includeDeleted: false });
  if (!listing) {
    return res.status(404).json({ message: "Anuncio nao encontrado." });
  }

  if (!listing.is_approved) {
    return res.status(400).json({ message: "Apenas anuncios aprovados podem ser reativados." });
  }

  if (listing.status !== "suspended") {
    return res.status(400).json({ message: "So anuncios suspensos podem ser reativados." });
  }

  const updated = await setListingStatusAdmin(listing.id, "active");
  return res.json(updated);
};

export const updateFeatured = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const requested = typeof req.body?.is_featured === "boolean"
    ? req.body.is_featured
    : req.body?.isFeatured;

  if (typeof requested !== "boolean") {
    return res.status(400).json({ message: "is_featured obrigatorio." });
  }

  const client = await db.getClient();
  try {
    await client.query("BEGIN");
    const listingResult = await client.query(
      "SELECT id, is_approved, is_featured FROM listings WHERE id = $1 AND deleted_at IS NULL FOR UPDATE",
      [req.params.id]
    );
    const listing = listingResult.rows[0];
    if (!listing) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Anuncio nao encontrado." });
    }

    if (!listing.is_approved) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Apenas anuncios aprovados podem ser destacados." });
    }

    if (requested && !listing.is_featured) {
      const featuredResult = await client.query(
        "SELECT id FROM listings WHERE is_featured = true AND deleted_at IS NULL AND is_approved = true FOR UPDATE"
      );
      if (featuredResult.rowCount >= 3) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "Limite de destaques atingido (max. 3)." });
      }
    }

    const updated = await client.query(
      "UPDATE listings SET is_featured = $2, updated_at = NOW() WHERE id = $1 RETURNING *",
      [listing.id, requested]
    );

    await client.query("COMMIT");
    return res.json(updated.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ message: "Erro interno." });
  } finally {
    client.release();
  }
};

export const remove = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const listing = await softDeleteListing(req.params.id, req.user.id);
  if (!listing) {
    return res.status(404).json({ message: "Anuncio nao encontrado." });
  }
  return res.status(200).json({ message: "Anuncio removido." });
};

export const uploadImages = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const owned = await getListingOwnedByUser(req.params.id, req.user.id);
  if (!owned) {
    return res.status(404).json({ message: "Anuncio nao encontrado." });
  }

  const files = req.files as Express.Multer.File[] | undefined;
  if (!files?.length) {
    return res.status(400).json({ message: "Envie pelo menos uma imagem." });
  }

  const urls = files.map((file) => toPublicUploadUrl(file.path));
  const images = await addListingImages(req.params.id, urls);
  return res.status(201).json(withFilename(images));
};

export const deleteImage = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const listing = req.user.role === "admin"
    ? await getListingById(req.params.id, { includeUnapproved: true, includeDeleted: false })
    : await getListingOwnedByUser(req.params.id, req.user.id);

  if (!listing) {
    return res.status(404).json({ message: "Anuncio nao encontrado." });
  }

  const image = await getListingImageById(req.params.id, req.params.imageId);
  if (!image) {
    return res.status(404).json({ message: "Imagem nao encontrada." });
  }

  const deleted = await deleteListingImage(req.params.id, req.params.imageId);
  if (deleted?.url) {
    const filePath = resolveUploadPath(deleted.url);
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (error: any) {
        if (error?.code !== "ENOENT") {
          throw error;
        }
      }
    }
  }

  return res.json({ ok: true });
};

export const reorderImages = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const orders = req.body?.orders as { id: string; sortOrder: number }[];
  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ message: "Ordenacao invalida." });
  }
  await updateListingImageOrder(req.params.id, orders);
  return res.json({ message: "Ordem atualizada." });
};

export const adminList = async (_req: Request, res: Response) => {
  const listings = await listAdminListings();
  return res.json(listings);
};

export const adminApprove = async (req: Request, res: Response) => {
  const listing = await approveListing(req.params.id, true);
  if (!listing) {
    return res.status(404).json({ message: "Anuncio nao encontrado." });
  }
  return res.json(listing);
};

export const adminReject = async (req: Request, res: Response) => {
  const listing = await approveListing(req.params.id, false);
  if (!listing) {
    return res.status(404).json({ message: "Anuncio nao encontrado." });
  }
  return res.json(listing);
};
