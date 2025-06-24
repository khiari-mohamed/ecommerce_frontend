import React from "react";
import { Brand } from "@/types/brand";
import "../../styles/dashboard.css";

interface BrandsConfirmDeleteModalProps {
  open: boolean;
  brand: Brand | null;
  onClose: () => void;
  onConfirm: () => void;
}

const BrandsConfirmDeleteModal: React.FC<BrandsConfirmDeleteModalProps> = ({
  open,
  brand,
  onClose,
  onConfirm,
}) => {
  if (!open || !brand) return null;

  return (
    <div className="modal-overlay">
      <div className="modal brands-delete-modal">
        <div className="modal-header">
          <h2>Supprimer la marque</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>
            Êtes-vous sûr de vouloir supprimer la marque{" "}
            <strong>{brand.designation_fr}</strong> ?
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-danger" onClick={onConfirm}>
            Supprimer
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandsConfirmDeleteModal;