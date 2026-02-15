import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Dashboard from "../pages/Dashboard";

const DashboardRoute: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  if (isAdmin) {
    return <Navigate to="/admin/anuncios" replace />;
  }

  return <Dashboard />;
};

export default DashboardRoute;
