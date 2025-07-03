import React from "react";
import Image from "next/image";
import { Brand } from "@/types/brand";
import "../../styles/dashboard.css";

interface BrandsViewModalProps {
  open: boolean;
  brand: Brand | null;
  onClose: () => void;
}

const BrandsViewModal: React.FC<BrandsViewModalProps> = ({ open, brand, onClose }) => {
  if (!open || !brand) return null;

  return (
    <div className="modal-overlay">
      <div className="modal brands-view-modal">
        <div className="modal-header">
          <h2>Détails de la marque</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="brand-details">
            <Image
              src={brand.logo}
              alt={brand.designation_fr}
              width={120}
              height={120}
              className="brand-logo-large"
              loading="lazy"
            />
            <h3>{brand.designation_fr}</h3>
            <div
              className="brand-description"
              dangerouslySetInnerHTML={{ __html: brand.description_fr || "" }}
            />
            <div className="brand-meta">
              <strong>Meta:</strong> {brand.meta}
            </div>
            <div className="brand-seo">
              <strong>SEO:</strong> {brand.content_seo}
            </div>
            <div className="brand-more-details">
              <strong>Plus de détails:</strong> {brand.more_details}
            </div>
            {/* Add more fields as needed */}
            <div className="brand-dates">
              <span>
                <strong>Créé le:</strong>{" "}
                {brand.created_at ? new Date(brand.created_at).toLocaleString() : "-"}
              </span>
              <span>
                <strong>Modifié le:</strong>{" "}
                {brand.updated_at ? new Date(brand.updated_at).toLocaleString() : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsViewModal;