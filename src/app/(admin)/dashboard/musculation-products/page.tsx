"use client"
import React, { useState } from "react";
import MusculationProductTable from "../components/ecommerce/MusculationProductTable";
import MusculationProductFormModal from "../components/modals/MusculationProductFormModal";
import MusculationProductViewModal from "../components/modals/MusculationProductViewModal";
import MusculationProductConfirmDeleteModal from "../components/modals/MusculationProductConfirmDeleteModal";
import { MusculationProduct } from "../../../../types/MusculationProducts";

export default function MusculationProductsPage() {
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MusculationProduct | null>(null);

  return (
    <div className="dashboard-section">
      <div className="dashboard-section-header">
        <h1 className="dashboard-section-title">Musculation Products</h1>
        <button className="dashboard-btn" onClick={() => setOpenForm(true)}>
          + Add Product
        </button>
      </div>
      <MusculationProductTable
        onEdit={(product) => {
          setSelectedProduct(product);
          setOpenForm(true);
        }}
        onView={(product) => {
          setSelectedProduct(product);
          setOpenView(true);
        }}
        onDelete={(product) => {
          setSelectedProduct(product);
          setOpenDelete(true);
        }}
      />
      <MusculationProductFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
      <MusculationProductViewModal
        open={openView}
        onClose={() => {
          setOpenView(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
      <MusculationProductConfirmDeleteModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </div>
  );
}