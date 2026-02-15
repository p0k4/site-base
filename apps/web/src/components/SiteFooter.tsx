import React from "react";
import { useCompanySettings } from "../contexts/CompanySettingsContext";
import { useCompanyPublic } from "../hooks/useCompanyPublic";
import { resolveMediaUrl } from "../lib/media";
import { appConfig } from "../config/appConfig";
import { brandText } from "../config/branding";

const SiteFooter: React.FC = () => {
  const { settings } = useCompanySettings();
  const { data: publicCompany } = useCompanyPublic();
  const logoUrl = settings?.logoUrl;
  const fallbackLogo = appConfig.BRAND_LOGO_PATH || "";
  const logoSrc = logoUrl ? resolveMediaUrl(logoUrl) : (fallbackLogo || null);
  const companyName = settings?.companyName?.trim() || appConfig.APP_NAME;
  const location = publicCompany?.address?.trim() || appConfig.COMPANY.LOCATION;
  const email = publicCompany?.email?.trim() || appConfig.COMPANY.EMAIL;
  const year = new Date().getFullYear();
  const copyright = `© ${year} ${companyName}. ${brandText.footerCopyright}`;

  return (
    <footer className="w-full border-t border-black/10 bg-brand-50/70 mt-16">
      <div className="w-full max-w-7xl lg:max-w-[90%] xl:max-w-[88%] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="w-full flex flex-col gap-6 sm:gap-8 md:flex-row md:items-start md:justify-between text-sm text-brand-700">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={companyName}
                  className="h-7 w-auto object-contain"
                />
              ) : null}
            </div>
            <p className="text-brand-600">{brandText.tagline}</p>
            <p className="text-xs text-brand-500">{copyright}</p>
          </div>

          <div className="space-y-3 text-sm">
            {location ? (
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Localização</p>
                <p className="text-brand-700">
                  {location.split(/\r?\n/).filter(Boolean).map((line, index) => (
                    <span key={`${line}-${index}`} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            ) : null}
            {email ? (
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Email</p>
                <a className="footer-link text-brand-700" href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            ) : null}
            <div>
              <a className="footer-link text-brand-700" href="/politica-privacidade">Política de Privacidade</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
