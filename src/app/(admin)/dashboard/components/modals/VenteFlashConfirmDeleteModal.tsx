import React, { useState } from "react";
import { deleteVenteFlash } from "../../../../../services/venteFlash";
import { VenteFlash } from "../../../../../types/venteFlash";
import "../../styles/dashboard.css";
interface Props {
  open: boolean;
  onClose: () => void;
  venteFlash: VenteFlash | null;
}

export default function VenteFlashConfirmDeleteModal({ open, onClose, venteFlash }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!venteFlash?._id) return;
    setLoading(true);
    try {
      await deleteVenteFlash(venteFlash._id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open || !venteFlash) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content">
        <h2>Delete Vente Flash</h2>
        <p>Are you sure you want to delete <strong>{venteFlash.designation_fr}</strong>?</p>
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