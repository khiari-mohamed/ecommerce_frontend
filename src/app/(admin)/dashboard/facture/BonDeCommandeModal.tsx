import React from "react";
import "./facture.css";
interface BonDeCommandeModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BonDeCommandeModal = ({ open, onClose, children }: BonDeCommandeModalProps) => {
  if (!open) return null;
  return (
    <div className="bon-modal-overlay">
      <div className="bon-modal-content relative">
        <button
          className="bon-modal-close absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default BonDeCommandeModal;