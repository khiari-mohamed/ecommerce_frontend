"use client";

import React, { useEffect, useState } from "react";
import { Brand } from "@/types/brand";
import BrandsTable from "../components/ecommerce/brandsTable";
import BrandsFormModal from "../components/modals/brandsFormModal";
import BrandsViewModal from "../components/modals/brandsViewModal";
import BrandsConfirmDeleteModal from "../components/modals/brandsConfirmDeleteModal";
import {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../utils/brands";
import "../styles/dashboard.css";

const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Brand selected for view/edit/delete
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Fetch brands
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await getAllBrands();
      setBrands(data);
    } catch (err) {
      // TODO: handle error (toast, etc)
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Handlers
  const handleAdd = () => {
    setFormMode("add");
    setSelectedBrand(null);
    setShowFormModal(true);
  };

  const handleEdit = (brand: Brand) => {
    setFormMode("edit");
    setSelectedBrand(brand);
    setShowFormModal(true);
  };

  const handleView = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowViewModal(true);
  };

  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (brand: Brand) => {
    if (formMode === "add") {
      await createBrand(brand);
    } else if (formMode === "edit" && selectedBrand) {
      await updateBrand(selectedBrand._id, brand);
    }
    setShowFormModal(false);
    fetchBrands();
  };

  const handleConfirmDelete = async () => {
    if (selectedBrand) {
      await deleteBrand(selectedBrand._id);
      setShowDeleteModal(false);
      fetchBrands();
    }
  };

  return (
    <div className="dashboard-brands-page">
      <div className="dashboard-header">
        <h1>Gestion des Marques</h1>
        <button className="btn-primary" onClick={handleAdd}>
          + Ajouter une marque
        </button>
      </div>
      {loading ? (
        <div className="dashboard-loader">Chargement...</div>
      ) : (
        <BrandsTable
          brands={brands}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modals */}
      <BrandsFormModal
        open={showFormModal}
        mode={formMode}
        brand={formMode === "edit" ? selectedBrand : null}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
      />
      <BrandsViewModal
        open={showViewModal}
        brand={selectedBrand}
        onClose={() => setShowViewModal(false)}
      />
      <BrandsConfirmDeleteModal
        open={showDeleteModal}
        brand={selectedBrand}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default BrandsPage;