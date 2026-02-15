import { Request, Response } from "express";
import { createLead, listPurchaseLeads, listServiceLeads } from "../services/leadsService";

export const create = async (req: Request, res: Response) => {
  const lead = await createLead({
    userId: (req as any).user?.id || null,
    listingId: req.body.listingId,
    serviceId: req.body.serviceId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message
  });

  return res.status(201).json({ message: "Pedido enviado com sucesso.", leadId: lead.id });
};

export const listAdmin = async (_req: Request, res: Response) => {
  const leads = await listServiceLeads();
  return res.json(leads);
};

export const listAdminPurchases = async (_req: Request, res: Response) => {
  const leads = await listPurchaseLeads();
  return res.json(leads);
};
