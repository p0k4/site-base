import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { User } from "lucide-react";
import { useCompanySettings } from "../contexts/CompanySettingsContext";
import { resolveMediaUrl } from "../lib/media";
import { appConfig } from "../config/appConfig";

type SiteHeaderProps = {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
};

const SiteHeader: React.FC<SiteHeaderProps> = ({ onToggleSidebar, showSidebarToggle }) => {
  const { user } = useAuth();
  const { settings } = useCompanySettings();
  const logoUrl = settings?.logoUrl;
  const fallbackLogo = appConfig.BRAND_LOGO_PATH || "";
  const logoSrc = logoUrl ? resolveMediaUrl(logoUrl) : (fallbackLogo || null);
  const companyName = settings?.companyName?.trim() || appConfig.APP_NAME;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const closeMobileNav = () => setMobileNavOpen(false);
  const navItems = [
    { to: "/carros", label: "Carros" },
    { to: "/servicos", label: "Serviços" },
    { to: "/contactos", label: "Quem Somos" }
  ];

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link text-sm uppercase tracking-[0.3em] ${isActive ? "active text-brand-900" : "text-brand-700"} hover:text-brand-900 transition`;

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileNavOpen]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", mobileNavOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [mobileNavOpen]);

  const mobileDrawer = !user && typeof document !== "undefined"
    ? createPortal(
      <>
        <button
          type="button"
          className={`mobile-overlay md:hidden ${mobileNavOpen ? "open" : ""}`}
          onClick={closeMobileNav}
          aria-label="Fechar menu"
          aria-hidden={!mobileNavOpen}
        />
        <aside
          className={`mobile-drawer md:hidden ${mobileNavOpen ? "open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-hidden={!mobileNavOpen}
        >
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <span className="text-xs uppercase tracking-[0.35em] text-brand-700">Menu</span>
            <button
              type="button"
              onClick={closeMobileNav}
              className="rounded-full border border-brand-200 px-2.5 py-1 text-[10px] uppercase tracking-[0.3em] text-brand-700"
            >
              Fechar
            </button>
          </div>
          <nav className="flex flex-col gap-2 px-5 py-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileNav}
                className="rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.3em] text-brand-600 transition hover:text-brand-900 hover:bg-brand-50"
              >
                {item.label}
              </NavLink>
            ))}
            <div className="my-2 h-px bg-black/10" />
            <Link
              to="/login"
              onClick={closeMobileNav}
              className="rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.3em] text-brand-600 transition hover:text-brand-900 hover:bg-brand-50"
            >
              Entrar
            </Link>
          </nav>
        </aside>
      </>,
      document.body
    )
    : null;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-black/5 shadow-sm">
      <div className="Topbar w-full max-w-7xl lg:max-w-[90%] xl:max-w-[88%] mx-auto">
        <Link to="/" className="BrandLogo" aria-label={companyName}>
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={companyName}
            />
          ) : (
            <span className="font-display text-2xl text-brand-900">
              {companyName}
            </span>
          )}
        </Link>

        <nav className="TopbarNav hidden md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="TopbarActions ml-auto">
          {user ? (
            showSidebarToggle && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden rounded-full border border-brand-200 bg-white px-3 py-2 text-brand-700 shadow-sm hover:border-brand-400 hover:text-brand-900 transition"
                aria-label="Abrir menu"
              >
                <span className="sr-only">Abrir menu</span>
                <span className="block h-[2px] w-5 bg-current" />
                <span className="mt-1 block h-[2px] w-5 bg-current" />
                <span className="mt-1 block h-[2px] w-5 bg-current" />
              </button>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="btn-brand-outline hidden md:inline-flex items-center gap-2 text-xs"
              >
                <User size={15} strokeWidth={1.9} aria-hidden="true" />
                Entrar
              </Link>
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="md:hidden rounded-full border border-brand-200 bg-white px-3 py-2 text-brand-700 shadow-sm hover:border-brand-400 hover:text-brand-900 transition"
                aria-label="Abrir menu"
              >
                <span className="sr-only">Abrir menu</span>
                <span className="block h-[2px] w-5 bg-current" />
                <span className="mt-1 block h-[2px] w-5 bg-current" />
                <span className="mt-1 block h-[2px] w-5 bg-current" />
              </button>
            </>
          )}
        </div>
      </div>

      {mobileDrawer}
    </header>
  );
};

export default SiteHeader;
