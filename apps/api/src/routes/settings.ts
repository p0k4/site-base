import { Router } from "express";
import multer from "multer";
import path from "path";
import { env } from "../config/env";
import { ensureDir } from "../utils/files";
import { validate } from "../middleware/validate";
import { getCompany, removeCompanyLogo, updateCompany, uploadCompanyLogo } from "../controllers/settingsController";
import { companySettingsSchema } from "../validators/settings";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(env.uploadDir, "branding");
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
    fileSize: 2 * 1024 * 1024,
    files: 1
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Tipo de ficheiro nao permitido."));
    }
    return cb(null, true);
  }
});

router.get("/company", getCompany);

router.use(requireAuth, requireAdmin);

router.put("/company", validate(companySettingsSchema), updateCompany);
router.post("/company/logo", upload.single("logo"), uploadCompanyLogo);
router.delete("/company/logo", removeCompanyLogo);

export default router;
