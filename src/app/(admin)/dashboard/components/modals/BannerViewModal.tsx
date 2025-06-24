import React from "react";
import Modal from "../ui/Modal";
import { Banner } from "@/types/banner";
import "../../styles/dashboard.css";
interface BannerViewModalProps {
  open: boolean;
  onClose: () => void;
  banner?: Banner | null;
}

const BannerViewModal: React.FC<BannerViewModalProps> = ({
  open,
  onClose,
  banner,
}) => {
  if (!banner) return null;
  return (
    <Modal open={open} onClose={onClose} title="Détails du banner">
      <div className="flex flex-col gap-4">
        <div>
          <span className="font-semibold">Titre:</span> {banner.title}
        </div>
        <div>
          <span className="font-semibold">Image:</span>
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="rounded mt-2"
            style={{ maxWidth: 320, maxHeight: 120 }}
          />
        </div>
        <div>
          <span className="font-semibold">Lien:</span>{" "}
          <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {banner.linkUrl}
          </a>
        </div>
        <div>
          <span className="font-semibold">Actif:</span>{" "}
          {banner.isActive ? (
            <span className="text-green-600 font-semibold">Oui</span>
          ) : (
            <span className="text-red-600 font-semibold">Non</span>
          )}
        </div>
        <div>
          <span className="font-semibold">Créé le:</span> {banner.createdAt || "-"}
        </div>
        <div>
          <span className="font-semibold">Mis à jour le:</span> {banner.updatedAt || "-"}
        </div>
      </div>
    </Modal>
  );
};

export default BannerViewModal;