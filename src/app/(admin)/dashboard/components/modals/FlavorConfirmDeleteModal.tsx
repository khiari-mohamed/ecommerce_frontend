import React from "react";
import { Aroma } from "@/types/aroma";
import { deleteFlavor } from "../../utils/fetchflavors";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface FlavorConfirmDeleteModalProps {
  flavor?: Aroma | null;
  onClose: () => void;
}

const FlavorConfirmDeleteModal: React.FC<FlavorConfirmDeleteModalProps> = ({ flavor, onClose }) => {
  const handleDelete = async () => {
    if (flavor) await deleteFlavor(flavor._id);
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Delete Flavor">
      <div style={{ padding: 24 }}>
        <p style={{ marginBottom: 24 }}>
          Are you sure you want to delete <b>{flavor?.designation_fr}</b>?
        </p>
        <div className="dashboard-modal-actions">
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default FlavorConfirmDeleteModal;