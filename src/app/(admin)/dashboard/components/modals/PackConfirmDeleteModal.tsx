import React, { useState } from "react";
import { deletePack } from "../../../../../services/pack";
import { Pack } from "../../../../../types/pack";
import "../../styles/dashboard.css";

interface Props {
  open: boolean;
  onClose: () => void;
  pack: Pack | null;
}

export default function PackConfirmDeleteModal({ open, onClose, pack }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!pack?._id) return;
    setLoading(true);
    try {
      await deletePack(pack._id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open || !pack) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content">
        <h2>Delete Pack</h2>
        <p>Are you sure you want to delete <strong>{pack.designation_fr}</strong>?</p>
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