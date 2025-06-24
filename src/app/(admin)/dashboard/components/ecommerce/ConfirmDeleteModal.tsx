import React from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  message = "Are you sure you want to delete this item?",
}) => {
  if (!open) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content">
        <p>{message}</p>
        <div className="dashboard-modal-actions">
          <button className="deleteBtn" onClick={onConfirm}>
            Delete
          </button>
          <button className="cancelBtn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;