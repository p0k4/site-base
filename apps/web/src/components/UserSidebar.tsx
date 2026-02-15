import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type UserSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const UserSidebar: React.FC<UserSidebarProps> = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(true);
  const [listingsOpen, setListingsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!user) {
    return null;
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between rounded-2xl px-5 py-3 text-xs uppercase tracking-[0.22em] ${
      isActive ? "bg-accent-200 text-brand-900" : "text-brand-700 hover:bg-brand-100/60 hover:text-brand-900"
    } transition`;

  const secondaryLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center rounded-xl px-3 py-2.5 text-[0.7rem] uppercase tracking-[0.2em] ${
      isActive ? "bg-white/70 text-brand-900" : "text-brand-600 hover:bg-white/60 hover:text-brand-900"
    } transition`;

  const topLevelButtonClass = (isOpen: boolean) =>
    `flex w-full items-center justify-between rounded-2xl px-5 py-3 text-xs uppercase tracking-[0.22em] ${
      isOpen ? "bg-brand-100 text-brand-900" : "text-brand-700 hover:bg-brand-100/60 hover:text-brand-900"
    } transition`;

  const handleNavigate = () => {
    if (open) {
      onClose();
    }
  };

  const displayName = user.name?.trim() || user.email?.split("@")[0] || "Utilizador";
  const roleLabel = user.role === "admin" ? "Administrador" : "Utilizador";
  const initial = displayName.charAt(0).toUpperCase();

  const content = (
    <div className="space-y-5">
      <div className="rounded-3xl border border-black/5 bg-white/90 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
            {initial}
          </div>
          <div>
            <p className="text-base font-semibold text-brand-900">{displayName}</p>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-brand-500">{roleLabel}</p>
          </div>
        </div>
      </div>

      <nav className="space-y-3">
        {user.role === "admin" ? (
          <>
            <button
              type="button"
              onClick={() => setListingsOpen((prev) => !prev)}
              className={topLevelButtonClass(listingsOpen)}
              aria-expanded={listingsOpen}
            >
              Anúncios
              <span className="text-[0.7rem]">{listingsOpen ? "–" : "+"}</span>
            </button>
            {listingsOpen && (
              <div className="mt-2 space-y-2 border-l border-black/10 pl-4">
                <NavLink to="/admin/anuncios" className={secondaryLinkClass} onClick={handleNavigate}>
                  Lista de anúncios
                </NavLink>
                <NavLink to="/admin/anuncios/criar" className={secondaryLinkClass} onClick={handleNavigate}>
                  Criar anúncio
                </NavLink>
                <NavLink to="/admin/informacoes-compra" className={secondaryLinkClass} onClick={handleNavigate}>
                  Informações de compra
                </NavLink>
              </div>
            )}
          </>
        ) : (
          <NavLink to="/dashboard" className={linkClass} onClick={handleNavigate}>
            Anúncios
          </NavLink>
        )}
        {user.role === "admin" && (
          <>
            <button
              type="button"
              onClick={() => setUsersOpen((prev) => !prev)}
              className={topLevelButtonClass(usersOpen)}
              aria-expanded={usersOpen}
            >
              Utilizadores
              <span className="text-[0.7rem]">{usersOpen ? "–" : "+"}</span>
            </button>
            {usersOpen && (
              <div className="mt-2 space-y-2 border-l border-black/10 pl-4">
                <NavLink to="/admin/utilizadores" className={secondaryLinkClass} onClick={handleNavigate}>
                  Lista de utilizadores
                </NavLink>
              </div>
            )}
            <button
              type="button"
              onClick={() => setServicesOpen((prev) => !prev)}
              className={topLevelButtonClass(servicesOpen)}
              aria-expanded={servicesOpen}
            >
              Serviços
              <span className="text-[0.7rem]">{servicesOpen ? "–" : "+"}</span>
            </button>
            {servicesOpen && (
              <div className="mt-2 space-y-2 border-l border-black/10 pl-4">
                <NavLink to="/admin/servicos-admin" className={secondaryLinkClass} onClick={handleNavigate}>
                  Criar serviços
                </NavLink>
                <NavLink to="/admin/pedidos-servico" className={secondaryLinkClass} onClick={handleNavigate}>
                  Pedidos de serviço
                </NavLink>
              </div>
            )}
            <button
              type="button"
              onClick={() => setSettingsOpen((prev) => !prev)}
              className={topLevelButtonClass(settingsOpen)}
              aria-expanded={settingsOpen}
            >
              Definições
              <span className="text-[0.7rem]">{settingsOpen ? "–" : "+"}</span>
            </button>
            {settingsOpen && (
              <div className="mt-2 space-y-2 border-l border-black/10 pl-4">
                <NavLink to="/admin/definicoes" className={secondaryLinkClass} onClick={handleNavigate}>
                  Definições
                </NavLink>
                <NavLink to="/admin/definicoes/dados-empresa" className={secondaryLinkClass} onClick={handleNavigate}>
                  Dados da empresa
                </NavLink>
              </div>
            )}
          </>
        )}

        <div className="h-px bg-black/5" />

        <button
          type="button"
          onClick={() => setAccountOpen((prev) => !prev)}
          className={topLevelButtonClass(accountOpen)}
          aria-expanded={accountOpen}
        >
          Minha conta
          <span className="text-[0.7rem]">{accountOpen ? "–" : "+"}</span>
        </button>
        {accountOpen && (
          <div className="mt-2 space-y-2 border-l border-black/10 pl-4">
            <NavLink to="/conta" className={secondaryLinkClass} onClick={handleNavigate}>
              Perfil
            </NavLink>
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex w-full items-center rounded-xl px-3 py-2.5 text-[0.7rem] uppercase tracking-[0.2em] text-red-400 hover:bg-red-50 hover:text-red-500 transition"
            >
              Sair
            </button>
          </div>
        )}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-80 shrink-0 px-6 py-6">
        <div className="sticky top-24 rounded-3xl border border-black/5 bg-white/80 backdrop-blur shadow-sm p-6">
          {content}
        </div>
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-label="Fechar menu"
          />
          <div className="relative h-full w-80 max-w-[85%] bg-brand-50 p-6 shadow-2xl">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-brand-200 bg-white px-3 py-2 text-xs uppercase tracking-[0.3em] text-brand-700 shadow-sm hover:border-brand-400 hover:text-brand-900 transition"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 rounded-3xl border border-black/5 bg-white/80 backdrop-blur shadow-sm p-6">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSidebar;
