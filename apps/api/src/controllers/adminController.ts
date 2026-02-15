import { Request, Response } from "express";
import { listUsers, setUserBlocked } from "../services/usersService";

export const listAllUsers = async (_req: Request, res: Response) => {
  const users = await listUsers();
  return res.json(users);
};

export const blockUser = async (req: Request, res: Response) => {
  const user = await setUserBlocked(req.params.id, true);
  if (!user) {
    return res.status(404).json({ message: "Utilizador nao encontrado." });
  }
  return res.json(user);
};

export const unblockUser = async (req: Request, res: Response) => {
  const user = await setUserBlocked(req.params.id, false);
  if (!user) {
    return res.status(404).json({ message: "Utilizador nao encontrado." });
  }
  return res.json(user);
};
