"use client";
import React, { useState } from "react";
import PackTable from "../components/ecommerce/PackTable";
import PackFormModal from "../components/modals/PackFormModal";
import PackViewModal from "../components/modals/PackViewModal";
import PackConfirmDeleteModal from "../components/modals/PackConfirmDeleteModal";
import { Pack } from "../../../../types/pack";
import "../styles/dashboard.css";


export default function PacksPage() {
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  return (
    <div className="dashboard-section">
      <div className="dashboard-section-header">
        <h1 className="dashboard-section-title">Packs</h1>
        <button className="dashboard-btn" onClick={() => setOpenForm(true)}>
          + Add Pack
        </button>
      </div>
      <PackTable
        onEdit={(pack) => {
          setSelectedPack(pack);
          setOpenForm(true);
        }}
        onView={(pack) => {
          setSelectedPack(pack);
          setOpenView(true);
        }}
        onDelete={(pack) => {
          setSelectedPack(pack);
          setOpenDelete(true);
        }}
      />
      <PackFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedPack(null);
        }}
        pack={selectedPack}
      />
      <PackViewModal
        open={openView}
        onClose={() => {
          setOpenView(false);
          setSelectedPack(null);
        }}
        pack={selectedPack}
      />
      <PackConfirmDeleteModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedPack(null);
        }}
        pack={selectedPack}
      />
    </div>
  );
}