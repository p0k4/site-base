import React from "react";
import Dashboard from "./Dashboard";

const AdminListings: React.FC = () => {
  return <Dashboard mode="list" adminListPath="/admin/anuncios" adminCreatePath="/admin/anuncios/criar" />;
};

export default AdminListings;
