import { Router } from "express";
import { getMe, updateMe } from "../controllers/usersController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { profileSchema } from "../validators/users";

const router = Router();

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, validate(profileSchema), updateMe);

export default router;
