import { Router } from "express";
import { login, logout, refresh, register } from "../controllers/authController";
import { authLimiter, loginLimiter, registerLimiter } from "../middleware/rateLimit";
import { validate } from "../middleware/validate";
import { loginSchema, refreshSchema, registerSchema } from "../validators/auth";

const router = Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", logout);

export default router;
