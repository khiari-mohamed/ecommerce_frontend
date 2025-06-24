import React, { useState } from "react";
import { Product } from "@/types/product";
import  Modal  from "../ui/Modal";
import  Button  from "../ui/Button";
import { deleteProduct } from "@/services/products";
import "../../styles/dashboard.css";
interface ConfirmDeleteModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirm?: () => void; // Callback to refresh table
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  product,
  onClose,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!product) return;
    setLoading(true);
    try {
      await deleteProduct(product._id);
      if (onConfirm) onConfirm();
      onClose();
    } catch (err) {
      // TODO: Show error toast
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Delete Product">
      <div className="space-y-4">
        <p>
          Are you sure you want to delete <b>{product?.title}</b>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" loading={loading} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;