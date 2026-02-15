import { Router } from "express";
import { getCompanyPublic } from "../controllers/settingsController";

const router = Router();

router.get("/", getCompanyPublic);

export default router;
