import { Request, Response } from "express";
import { createContacto } from "../services/contactosService";

export const create = async (req: Request, res: Response) => {
  const contacto = await createContacto({
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact,
    message: req.body.message
  });

  return res.status(201).json({ message: "Contacto enviado com sucesso.", contactoId: contacto.id });
};
