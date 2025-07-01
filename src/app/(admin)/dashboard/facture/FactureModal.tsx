import React from "react";
import "../styles/print.css";

interface FactureModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const FactureModal = ({ open, onClose, children }: FactureModalProps) => {
  if (!open) return null;
  return (
    <div className="facture-modal-overlay">
      <div className="facture-modal-content relative">
        <button
          className="facture-modal-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default FactureModal;