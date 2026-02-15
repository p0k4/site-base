import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { env } from "../config/env";
import { safeJoin } from "../utils/files";
import {
  getCompanySettings,
  updateCompanyLogo,
  updateCompanySettings,
  MissingCompanySettingsTableError
} from "../services/settingsService";

const removeLogoFile = (logoUrl: string | null) => {
  if (!logoUrl) return;
  const uploadRoot = path.resolve(process.cwd(), env.uploadDir);
  const relative = logoUrl.startsWith("/uploads/") ? logoUrl.replace("/uploads/", "") : logoUrl;
  const fullPath = safeJoin(uploadRoot, relative);
  if (!fullPath.startsWith(uploadRoot)) return;
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

export const getCompany = async (_req: Request, res: Response) => {
  try {
    const settings = await getCompanySettings();
    return res.json(settings);
  } catch (error: any) {
    if (error instanceof MissingCompanySettingsTableError) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro interno." });
  }
};

export const getCompanyPublic = async (_req: Request, res: Response) => {
  try {
    const settings = await getCompanySettings();
    return res.json({
      company_name: settings?.company_name || "",
      email: settings?.email || "",
      phone: settings?.phone || "",
      address: settings?.address || ""
    });
  } catch (error: any) {
    if (error instanceof MissingCompanySettingsTableError) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro interno." });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const settings = await updateCompanySettings({
      companyName: req.body.companyName ?? null,
      nif: req.body.nif ?? null,
      address: req.body.address ?? null,
      socialArea: req.body.socialArea ?? null,
      phone: req.body.phone ?? null,
      email: req.body.email ?? null
    });
    return res.json(settings);
  } catch (error: any) {
    if (error instanceof MissingCompanySettingsTableError) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro interno." });
  }
};

export const uploadCompanyLogo = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ message: "Ficheiro nao encontrado." });
    }
    const current = await getCompanySettings();
    removeLogoFile(current.logo_url);
    const logoUrl = `/uploads/branding/${file.filename}`;
    const settings = await updateCompanyLogo(logoUrl);
    return res.json(settings);
  } catch (error: any) {
    if (error instanceof MissingCompanySettingsTableError) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro interno." });
  }
};

export const removeCompanyLogo = async (_req: Request, res: Response) => {
  try {
    const current = await getCompanySettings();
    removeLogoFile(current.logo_url);
    const settings = await updateCompanyLogo(null);
    return res.json(settings);
  } catch (error: any) {
    if (error instanceof MissingCompanySettingsTableError) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro interno." });
  }
};
