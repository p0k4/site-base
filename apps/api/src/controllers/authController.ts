import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { createUser, findUserByEmail } from "../services/usersService";
import { getActiveRefreshTokens, revokeAllRefreshTokens, revokeRefreshToken, saveRefreshToken } from "../services/refreshTokensService";
import bcrypt from "bcryptjs";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, phone, location } = req.body;

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: "Este email ja esta registado." });
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ name, email, passwordHash, phone, location });

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  const decoded = jwt.decode(refreshToken) as { exp?: number } | null;
  const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const tokenHash = await hashPassword(refreshToken);
  await saveRefreshToken({ userId: user.id, tokenHash, expiresAt });

  return res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "Credenciais invalidas." });
  }

  if (user.is_blocked) {
    return res.status(403).json({ message: "Conta bloqueada. Fale connosco." });
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ message: "Credenciais invalidas." });
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  const decoded = jwt.decode(refreshToken) as { exp?: number } | null;
  const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const tokenHash = await hashPassword(refreshToken);
  await saveRefreshToken({ userId: user.id, tokenHash, expiresAt });

  return res.status(200).json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const payload = verifyRefreshToken(refreshToken);
    const activeTokens = await getActiveRefreshTokens(payload.sub);

    const match = await Promise.all(
      activeTokens.map(async (token) => ({
        tokenId: token.id,
        matches: await bcrypt.compare(refreshToken, token.token_hash)
      }))
    );

    const current = match.find((item) => item.matches);
    if (!current) {
      return res.status(401).json({ message: "Refresh token invalido." });
    }

    await revokeRefreshToken(current.tokenId);

    const accessToken = signAccessToken({ sub: payload.sub, role: payload.role });
    const newRefreshToken = signRefreshToken({ sub: payload.sub, role: payload.role });

    const decoded = jwt.decode(newRefreshToken) as { exp?: number } | null;
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const tokenHash = await hashPassword(newRefreshToken);
    await saveRefreshToken({ userId: payload.sub, tokenHash, expiresAt });

    return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ message: "Refresh token invalido." });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(200).json({ message: "Logout com sucesso." });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    await revokeAllRefreshTokens(payload.sub);
  } catch (error) {
    // ignore
  }

  return res.status(200).json({ message: "Logout com sucesso." });
};
