import React from "react";
import Dashboard from "./Dashboard";

const AdminCreateListing: React.FC = () => {
  return <Dashboard mode="create" adminListPath="/admin/anuncios" adminCreatePath="/admin/anuncios/criar" />;
};

export default AdminCreateListing;
