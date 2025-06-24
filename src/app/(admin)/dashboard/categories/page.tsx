"use client";
import React, { useState } from "react";
import CategoryTable from "../components/ecommerce/CategoryTable";
import CategoryFormModal from "../components/modals/CategoryFormModal";
import CategoryViewModal from "../components/modals/CategoryViewModal";
import ConfirmDeleteModal from "../components/modals/CategoryConfirmDeleteModal";
import { Category } from "@/types/category";
import { createCategory, updateCategory, deleteCategory } from "@/services/categories";
import "../styles/dashboard.css";

const CategoriesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showView, setShowView] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshTable = () => setRefreshKey((k) => k + 1);

  const handleEdit = (category: Category | null) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setShowDelete(true);
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setShowView(true);
  };

  const handleFormSave = async (data: any, image?: File | null) => {
    if (selectedCategory) {
      await updateCategory(selectedCategory._id, data, image);
    } else {
      await createCategory(data, image);
    }
    setShowForm(false);
    refreshTable();
  };

  const handleDeleteConfirm = async () => {
    if (selectedCategory) {
      await deleteCategory(selectedCategory._id);
      setShowDelete(false);
      refreshTable();
    }
  };

  return (
    <div className="categories-page-root">
      <div className="categories-page-header">
        <h1 className="categories-page-title">Categories</h1>
        <p className="categories-page-subtitle">
          Manage your product categories. Add, edit, view, or remove categories as needed.
        </p>
      </div>
      <CategoryTable
        key={refreshKey}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
      {showForm && (
        <CategoryFormModal
          category={selectedCategory}
          onClose={() => setShowForm(false)}
          onSave={handleFormSave}
        />
      )}
      {showDelete && (
        <ConfirmDeleteModal
          category={selectedCategory}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {showView && selectedCategory && (
        <CategoryViewModal
          category={selectedCategory}
          onClose={() => setShowView(false)}
        />
      )}
    </div>
  );
};

export default CategoriesPage;