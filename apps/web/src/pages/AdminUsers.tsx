import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";
import { brandText } from "../config/branding";

const AdminUsers: React.FC = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    const { data } = await api.get("/admin/users");
    setUsers(data);
  };

  useEffect(() => {
    loadUsers().catch(() => null);
  }, []);

  const toggleBlock = async (id: string, blocked: boolean) => {
    await api.patch(`/admin/users/${id}/${blocked ? "block" : "unblock"}`);
    await loadUsers();
  };

  return (
    <div className="w-full max-w-7xl lg:max-w-[94%] xl:max-w-[92%] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      <PageHeader title={brandText.adminSectionTitle} />

      <section className="grid gap-5">
        <div className="glass-panel rounded-3xl p-5 space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-700">Utilizadores</p>
          <div className="space-y-3 max-h-80 overflow-auto">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between border-b border-black/5 pb-3">
                <div>
                  <p className="text-sm text-brand-900">{user.name}</p>
                  <p className="text-xs text-brand-700">{user.email}</p>
                </div>
                {authUser && (authUser.id === user.id || authUser.email?.toLowerCase() === String(user.email).toLowerCase()) ? null : (
                  <button
                    className="text-xs uppercase tracking-[0.3em] text-brand-700"
                    onClick={() => toggleBlock(user.id, !user.is_blocked)}
                  >
                    {user.is_blocked ? "Desbloquear" : "Bloquear"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminUsers;
