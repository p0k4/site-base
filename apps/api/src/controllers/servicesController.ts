import { Request, Response } from "express";
import { createService, deleteService, listAdminServices, listServices, updateService } from "../services/servicesService";

export const listPublic = async (_req: Request, res: Response) => {
  const services = await listServices();
  return res.json(services);
};

export const listAdmin = async (_req: Request, res: Response) => {
  const services = await listAdminServices();
  return res.json(services);
};

export const create = async (req: Request, res: Response) => {
  const service = await createService({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    isActive: req.body.isActive
  });
  return res.status(201).json(service);
};

export const update = async (req: Request, res: Response) => {
  const service = await updateService(req.params.id, req.body);
  if (!service) {
    return res.status(404).json({ message: "Servico nao encontrado." });
  }
  return res.json(service);
};

export const remove = async (req: Request, res: Response) => {
  await deleteService(req.params.id);
  return res.json({ message: "Servico removido." });
};
