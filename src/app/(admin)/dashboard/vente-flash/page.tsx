"use client" ;
import React, { useState } from "react";
import VenteFlashTable from "../components/ecommerce/VenteFlashTable";
import VenteFlashFormModal from "../components/modals/VenteFlashFormModal";
import VenteFlashViewModal from "../components/modals/VenteFlashViewModal";
import VenteFlashConfirmDeleteModal from "../components/modals/VenteFlashConfirmDeleteModal";
import { VenteFlash } from "../../../../types/venteFlash";
import "../styles/dashboard.css";
export default function VenteFlashPage() {
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedVenteFlash, setSelectedVenteFlash] = useState<VenteFlash | null>(null);

  return (
    <div className="dashboard-section">
      <div className="dashboard-section-header">
        <h1 className="dashboard-section-title">Vente Flash</h1>
        <button className="dashboard-btn" onClick={() => setOpenForm(true)}>
          + Add Vente Flash
        </button>
      </div>
      <VenteFlashTable
        onEdit={(item) => {
          setSelectedVenteFlash(item);
          setOpenForm(true);
        }}
        onView={(item) => {
          setSelectedVenteFlash(item);
          setOpenView(true);
        }}
        onDelete={(item) => {
          setSelectedVenteFlash(item);
          setOpenDelete(true);
        }}
      />
      <VenteFlashFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedVenteFlash(null);
        }}
        venteFlash={selectedVenteFlash}
      />
      <VenteFlashViewModal
        open={openView}
        onClose={() => {
          setOpenView(false);
          setSelectedVenteFlash(null);
        }}
        venteFlash={selectedVenteFlash}
      />
      <VenteFlashConfirmDeleteModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedVenteFlash(null);
        }}
        venteFlash={selectedVenteFlash}
      />
    </div>
  );
}