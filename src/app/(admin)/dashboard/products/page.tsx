"use client";
import React, { useState } from "react";
import ProductTable from "../components/ecommerce/ProductTable";
import { Product } from "@/types/product";
import ProductFormModal from "../components/modals/ProductFormModal";
import ConfirmDeleteModal from "../components/modals/ProductConfirmDeleteModal.tsx";
import { toggleProductStatus } from "@/services/products";
import Toast from "../components/ui/Toast";
import ProductViewModal from "../components/modals/ProductViewModal";
import BulkImportExport from "../components/common/BulkImportExport";
import { fetchAllProducts, createProductsBulk } from "../utils/fetchProducts";
import Papa from "papaparse";

const ProductsPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const refreshTable = () => setRefreshKey((k) => k + 1);

  const handleEdit = (product: Product | null) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setShowDelete(true);
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      await toggleProductStatus(product._id);
      setToast({ type: "success", message: "Product status updated!" });
      refreshTable();
    } catch (err) {
      setToast({ type: "error", message: "Failed to update product status." });
      console.error(err);
    }
  };

  const handleView = (product: Product) => {
    setViewProduct(product);
  };

  // Bulk Import Handler
  const handleImport = async (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          await createProductsBulk(results.data as Product[]);
          setToast({ type: "success", message: "Products imported!" });
          refreshTable();
        } catch (err) {
          setToast({ type: "error", message: "Import failed." });
        }
      },
      error: () => setToast({ type: "error", message: "CSV parsing failed." }),
    });
  };

  // Bulk Export Handler
  const handleExport = async () => {
    try {
      const products = await fetchAllProducts();
      const csv = Papa.unparse(products);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setToast({ type: "error", message: "Export failed." });
    }
  };

  return (
    <div className="products-page-root">
      <div className="products-page-header">
        <h1 className="products-page-title">Products</h1>
        <p className="products-page-subtitle">
          Manage your store's products. Add, edit, view, or remove products as needed.
        </p>
      </div>
      <BulkImportExport
        entityName="Product"
        onImport={handleImport}
        onExport={handleExport}
      />
      <div className="products-page-table-card">
        <ProductTable
          key={refreshKey}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onView={handleView}
        />
      </div>
      {showForm && (
        <ProductFormModal
          product={selectedProduct}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false);
            setToast({ type: "success", message: "Product saved!" });
            refreshTable();
          }}
        />
      )}
      {showDelete && (
        <ConfirmDeleteModal
          product={selectedProduct}
          onClose={() => setShowDelete(false)}
          onConfirm={() => {
            setShowDelete(false);
            setToast({ type: "success", message: "Product deleted!" });
            refreshTable();
          }}
        />
      )}
      {viewProduct && (
        <ProductViewModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}
      {toast && (
        <Toast
          toast={toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProductsPage;