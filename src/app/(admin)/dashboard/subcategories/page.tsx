"use client";
import React, { useState } from "react";
import SubcategoryTable from "../components/ecommerce/SubcategoryTable";
import SubcategoryFormModal from "../components/modals/SubcategoryFormModal";
import SubcategoryViewModal from "../components/modals/SubcategoryViewModal";
import SubcategoryConfirmDeleteModal from "../components/modals/SubcategoryConfirmDeleteModal";
import "../styles/dashboard.css"; // Import the dashboard CSS

export default function SubcategoriesPage() {
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  return (
    <div className="dashboard-section dashboard-section--with-sidebar">
      <div className="dashboard-section-header">
        <h1 className="dashboard-section-title">Subcategories</h1>
        <button className="dashboard-btn" onClick={() => setOpenForm(true)}>
          + Add Subcategory
        </button>
      </div>
      <SubcategoryTable
        onEdit={(subcategory) => {
          setSelectedSubcategory(subcategory);
          setOpenForm(true);
        }}
        onView={(subcategory) => {
          setSelectedSubcategory(subcategory);
          setOpenView(true);
        }}
        onDelete={(subcategory) => {
          setSelectedSubcategory(subcategory);
          setOpenDelete(true);
        }}
      />
      <SubcategoryFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedSubcategory(null);
        }}
        subcategory={selectedSubcategory}
      />
      <SubcategoryViewModal
        open={openView}
        onClose={() => {
          setOpenView(false);
          setSelectedSubcategory(null);
        }}
        subcategory={selectedSubcategory}
      />
      <SubcategoryConfirmDeleteModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedSubcategory(null);
        }}
        subcategory={selectedSubcategory}
      />
    </div>
  );
}