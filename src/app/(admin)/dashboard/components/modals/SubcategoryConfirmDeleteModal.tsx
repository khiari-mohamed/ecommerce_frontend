import React, { useState } from "react";
import { deleteSubCategory } from "../../../../../services/subcategories";
import { SubCategory } from "../../../../../types/subcategory";
import "../../styles/dashboard.css";
interface Props {
  open: boolean;
  onClose: () => void;
  subcategory: SubCategory | null;
}

export default function SubcategoryConfirmDeleteModal({ open, onClose, subcategory }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!subcategory?._id) return;
    setLoading(true);
    try {
      await deleteSubCategory(subcategory._id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open || !subcategory) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content">
        <h2>Delete Subcategory</h2>
        <p>Are you sure you want to delete <strong>{subcategory.name || subcategory.designation}</strong>?</p>
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