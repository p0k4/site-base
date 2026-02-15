import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import UserSidebar from "./UserSidebar";

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const rootClass = `app-root ${user ? "is-private" : "is-public"} min-h-screen text-brand-900 flex flex-col`;

  return (
    <div className={rootClass}>
      <SiteHeader
        showSidebarToggle={Boolean(user)}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />
      <div className="relative flex flex-1 lg:gap-5">
        {user && (
          <UserSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        <div className="min-w-0 flex-1 flex flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default AppShell;
