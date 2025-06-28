import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Banner } from "@/types/banner";
import "../../styles/dashboard.css";

interface BannerConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  banner?: Banner | null;
}

const BannerConfirmDeleteModal: React.FC<BannerConfirmDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  banner,
}) => (
  open ? (
    <div className="banner-modal">
      <Modal open={open} onClose={onClose} title="Confirmer la suppression">
        <div className="flex flex-col gap-4">
          <p>
            Êtes-vous sûr de vouloir supprimer le banner{" "}
            <span className="font-semibold">{banner?.title}</span> ?
          </p>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="secondary">
              Annuler
            </Button>
            <Button onClick={onConfirm} variant="danger">
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  ) : null
);

export default BannerConfirmDeleteModal;