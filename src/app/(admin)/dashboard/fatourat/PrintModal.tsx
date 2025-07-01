import React from "react";
//import "./styles/print-correct.css";

const PrintModal = ({ open, onClose, children, onPrint }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600"
          >
            Imprimer / Exporter PDF
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintModal;