import { Router } from "express";
import { blockUser, listAllUsers, unblockUser } from "../controllers/adminController";
import { requireAdmin } from "../middleware/admin";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/users", listAllUsers);
router.patch("/users/:id/block", blockUser);
router.patch("/users/:id/unblock", unblockUser);

export default router;
