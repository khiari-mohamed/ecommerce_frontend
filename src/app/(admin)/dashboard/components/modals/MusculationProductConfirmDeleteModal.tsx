import React, { useState } from "react";
import { deleteMusculationProduct } from "../../../../../services/Musculationproducts";
import { MusculationProduct } from "../../../../../types/MusculationProducts";
import "../../styles/dashboard.css";
interface Props {
  open: boolean;
  onClose: () => void;
  product: MusculationProduct | null;
}

export default function MusculationProductConfirmDeleteModal({ open, onClose, product }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!product?._id) return;
    setLoading(true);
    try {
      await deleteMusculationProduct(product._id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open || !product) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content">
        <h2>Delete Product</h2>
        <p>Are you sure you want to delete <strong>{product.designation_fr}</strong>?</p>
        <div className="dashboard-modal-actions">
          <button onClick={handleDelete} disabled={loading}>
            Delete
          </button>
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}