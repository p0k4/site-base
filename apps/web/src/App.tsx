import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Services from "./pages/Services";
import Contactos from "./pages/Contactos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import AdminUsers from "./pages/AdminUsers";
import AdminServices from "./pages/AdminServices";
import AdminSettings from "./pages/AdminSettings";
import ServiceRequestsAdmin from "./pages/ServiceRequestsAdmin";
import AdminListings from "./pages/AdminListings";
import AdminCreateListing from "./pages/AdminCreateListing";
import PurchaseRequestsAdmin from "./pages/PurchaseRequestsAdmin";
import CompanySettings from "./pages/CompanySettings";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardRoute from "./components/DashboardRoute";
import { ToastProvider } from "./context/ToastContext";

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anuncios" element={<Listings />} />
          <Route path="/anuncios/:id" element={<ListingDetail />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registar" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/conta"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Navigate to="/admin/anuncios" replace />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/definicoes"
            element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/definicoes/dados-empresa"
            element={
              <AdminRoute>
                <CompanySettings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/utilizadores"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/servicos-admin"
            element={
              <AdminRoute>
                <AdminServices />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pedidos-servico"
            element={
              <AdminRoute>
                <ServiceRequestsAdmin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/anuncios"
            element={
              <AdminRoute>
                <AdminListings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/anuncios/criar"
            element={
              <AdminRoute>
                <AdminCreateListing />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/informacoes-compra"
            element={
              <AdminRoute>
                <PurchaseRequestsAdmin />
              </AdminRoute>
            }
          />
        </Routes>
      </AppShell>
    </ToastProvider>
  );
};

export default App;
