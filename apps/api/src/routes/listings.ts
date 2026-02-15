import { Router } from "express";
import multer from "multer";
import path from "path";
import { env } from "../config/env";
import { requireAuth } from "../middleware/auth";
import { createLimiter, importLimiter } from "../middleware/rateLimit";
import { validate } from "../middleware/validate";
import {
  adminApprove,
  adminList,
  adminReject,
  activateListing,
  create,
  deleteImage,
  getPublicById,
  getMineById,
  importLink,
  listMine,
  listPublic,
  reorderImages,
  remove,
  suspendListing,
  updateFeatured,
  update,
  updateStatus,
  uploadImages
} from "../controllers/listingsController";
import { listingCreateSchema, listingFeaturedSchema, listingFilterSchema, listingImportSchema, listingStatusSchema, listingUpdateSchema } from "../validators/listings";
import { ensureDir } from "../utils/files";
import { requireAdmin } from "../middleware/admin";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const listingId = req.params.id;
    const dir = path.join(env.uploadDir, "listings", listingId);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: env.uploadMaxFileSizeMb * 1024 * 1024,
    files: env.uploadMaxFiles
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Tipo de ficheiro nao permitido."));
    }
    return cb(null, true);
  }
});

router.get("/admin/all", requireAuth, requireAdmin, adminList);
router.patch("/admin/:id/approve", requireAuth, requireAdmin, adminApprove);
router.patch("/admin/:id/reject", requireAuth, requireAdmin, adminReject);
router.patch("/:id/suspend", requireAuth, requireAdmin, suspendListing);
router.patch("/:id/activate", requireAuth, requireAdmin, activateListing);
router.patch("/:id/featured", requireAuth, requireAdmin, validate(listingFeaturedSchema), updateFeatured);

router.get("/", validate(listingFilterSchema), listPublic);
router.get("/me", requireAuth, listMine);
router.get("/:id/owner", requireAuth, getMineById);
router.get("/:id", getPublicById);

router.post("/", requireAuth, createLimiter, validate(listingCreateSchema), create);
router.post("/import-link", requireAuth, importLimiter, validate(listingImportSchema), importLink);
router.put("/:id", requireAuth, validate(listingUpdateSchema), update);
router.patch("/:id/status", requireAuth, validate(listingStatusSchema), updateStatus);
router.delete("/:id", requireAuth, remove);
router.post("/:id/images", requireAuth, upload.array("images", 12), uploadImages);
router.delete("/:id/images/:imageId", requireAuth, deleteImage);
router.put("/:id/images/order", requireAuth, reorderImages);

export default router;
