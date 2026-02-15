import React from "react";
import PageHeader from "../components/PageHeader";
import { brandText } from "../config/branding";

const AdminSettings: React.FC = () => {
  return (
    <div className="w-full max-w-7xl lg:max-w-[94%] xl:max-w-[92%] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      <PageHeader title={brandText.adminSectionTitle} />

      <div className="glass-panel rounded-3xl p-6 text-brand-700">
        Definições administrativas em desenvolvimento.
      </div>
    </div>
  );
};

export default AdminSettings;
