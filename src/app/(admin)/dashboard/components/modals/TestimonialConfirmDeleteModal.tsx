
import React, { useState } from "react";
import  Modal  from "../ui/Modal";
import  Button  from "../ui/Button";
import { deleteTestimonial } from "../../utils/testimonials";
import "../../styles/dashboard.css";
interface TestimonialConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  testimonialId: string | null;
  onDeleted: () => void;
}

const TestimonialConfirmDeleteModal: React.FC<TestimonialConfirmDeleteModalProps> = ({
  open,
  onClose,
  testimonialId,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!testimonialId) return;
    setLoading(true);
    setError("");
    try {
      await deleteTestimonial(testimonialId);
      onDeleted();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Confirmer la suppression">
      <div className="flex flex-col gap-4">
        <p>Êtes-vous sûr de vouloir supprimer ce témoignage ? Cette action est irréversible.</p>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="secondary" disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleDelete} variant="danger" disabled={loading || !testimonialId}>
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TestimonialConfirmDeleteModal;
