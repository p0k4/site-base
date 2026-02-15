import { Router } from "express";
import { create } from "../controllers/contactosController";
import { validate } from "../middleware/validate";
import { contactosSchema } from "../validators/contactos";

const router = Router();

router.post("/", validate(contactosSchema), create);

export default router;
