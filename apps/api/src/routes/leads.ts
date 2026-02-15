import { Router } from "express";
import { create, listAdmin, listAdminPurchases } from "../controllers/leadsController";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import { optionalAuth } from "../middleware/optionalAuth";
import { validate } from "../middleware/validate";
import { leadSchema } from "../validators/leads";

const router = Router();

router.get("/admin", requireAuth, requireAdmin, listAdmin);
router.get("/admin/purchase", requireAuth, requireAdmin, listAdminPurchases);
router.post("/", optionalAuth, validate(leadSchema), create);

export default router;
