"use client";
import React, { useState } from "react";
import FlavorTable from "../components/ecommerce/FlavorTable";
import FlavorFormModal from "../components/modals/FlavorFormModal";
import FlavorConfirmDeleteModal from "../components/modals/FlavorConfirmDeleteModal";
import { Aroma } from "@/types/aroma";
import "../styles/dashboard.css";
import Button from "../components/ui/Button";
const FlavorsPage: React.FC = () => {
  const [selectedFlavor, setSelectedFlavor] = useState<Aroma | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

 return (
  <div className="dashboard-main-content">
    <h1 className="dashboard-page-title">Flavors / Aromas</h1>
    <div className="dashboard-card">

<Button
  variant="primary"
  onClick={() => {
    setSelectedFlavor(null);
    setShowForm(true);
  }}
>
  + Add New Flavor
</Button>

      <FlavorTable
        onEdit={(flavor) => { setSelectedFlavor(flavor); setShowForm(true); }}
        onDelete={(flavor) => { setSelectedFlavor(flavor); setShowDelete(true); }}
      />
    </div>
    {showForm && (
      <FlavorFormModal
        flavor={selectedFlavor}
        onClose={() => setShowForm(false)}
      />
    )}
    {showDelete && (
      <FlavorConfirmDeleteModal
        flavor={selectedFlavor}
        onClose={() => setShowDelete(false)}
      />
    )}
  </div>
);
};
export default FlavorsPage;