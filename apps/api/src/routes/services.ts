import { Router } from "express";
import { create, listAdmin, listPublic, remove, update } from "../controllers/servicesController";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import { validate } from "../middleware/validate";
import { serviceSchema, serviceUpdateSchema } from "../validators/services";

const router = Router();

router.get("/", listPublic);

router.get("/admin/all", requireAuth, requireAdmin, listAdmin);
router.post("/admin", requireAuth, requireAdmin, validate(serviceSchema), create);
router.put("/admin/:id", requireAuth, requireAdmin, validate(serviceUpdateSchema), update);
router.delete("/admin/:id", requireAuth, requireAdmin, remove);

export default router;
