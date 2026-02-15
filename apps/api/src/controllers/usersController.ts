import { Response } from "express";
import { AuthedRequest } from "../middleware/auth";
import { findUserById, updateUserProfile } from "../services/usersService";

export const getMe = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "Utilizador nao encontrado." });
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    role: user.role
  });
};

export const updateMe = async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await updateUserProfile(req.user.id, req.body);
  if (!user) {
    return res.status(404).json({ message: "Utilizador nao encontrado." });
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    role: user.role
  });
};
