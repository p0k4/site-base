import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { CompanySettingsProvider } from "./contexts/CompanySettingsContext";
import { applyBranding } from "./config/branding";

applyBranding();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CompanySettingsProvider>
          <App />
        </CompanySettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
