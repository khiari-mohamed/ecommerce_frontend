import React from "react";
import Image from "next/image";
import Modal from "../ui/Modal";
import { Banner } from "@/types/banner";
import "../../styles/dashboard.css";

interface BannerViewModalProps {
  open: boolean;
  onClose: () => void;
  banner?: Banner | null;
}

const renderField = (label: string, value: React.ReactNode) => (
  <div>
    <span className="font-semibold">{label}:</span>{" "}
    {value ?? <span className="text-gray-400">-</span>}
  </div>
);

const BannerViewModal: React.FC<BannerViewModalProps> = ({
  open,
  onClose,
  banner,
}) => {
  if (!banner) return null;

  return (
    <Modal open={open} onClose={onClose} title="Détails du banner">
      <div className="flex flex-col gap-2 max-h-[80vh] overflow-y-auto text-sm">
        {renderField("ID", banner._id)}
        {renderField("ID (custom)", banner.id)}
        {renderField("Sous-catégorie ID", banner.sous_categorie_id)}
        {renderField("Désignation (FR)", banner.designation_fr)}
        {renderField("Cover", banner.cover)}
        {renderField("Quantité", banner.qte)}
        {renderField("Prix HT", banner.prix_ht)}
        {renderField("Prix", banner.prix)}
        {renderField("Promo HT", banner.promo_ht)}
        {renderField("Promo", banner.promo)}
        {/* Render description_fr as HTML */}
        <div>
          <span className="font-semibold">Description (FR):</span>
          <div
            className="dashboard-modal-html"
            dangerouslySetInnerHTML={{
              __html: banner.description_fr || "",
            }}
          />
        </div>
        {renderField("Publier", banner.publier)}
        {renderField("Créé par", banner.created_by)}
        {renderField("Mis à jour par", banner.updated_by)}
        {renderField("Créé le", banner.created_at)}
        {renderField("Mis à jour le", banner.updated_at)}
        {renderField("Code produit", banner.code_product)}
        {renderField("Slug", banner.slug)}
        {renderField("Pack", banner.pack)}
        {renderField("Brand ID", banner.brand_id)}
        {renderField("Nouveau produit", banner.new_product)}
        {renderField("Best seller", banner.best_seller)}
        {renderField("Galerie", banner.gallery)}
        {renderField("Note", banner.note)}
        {/* Render meta_description_fr as HTML */}
        <div>
          <span className="font-semibold">Meta description (FR):</span>
          <div
            className="dashboard-modal-html"
            dangerouslySetInnerHTML={{
              __html: banner.meta_description_fr || "",
            }}
          />
        </div>
        {renderField("Expiration promo", banner.promo_expiration_date)}
        {renderField("Rupture", banner.rupture)}
        {renderField("Alt cover", banner.alt_cover)}
        {renderField("Description cover", banner.description_cover)}
        {renderField("Meta", banner.meta)}
        {renderField("Content SEO", banner.content_seo)}
        {renderField("Review", banner.review)}
        {renderField("Aggregate Rating", banner.aggregateRating)}
        {/* Render nutrition_values as HTML */}
        <div>
          <span className="font-semibold">Valeurs nutritionnelles:</span>
          <div
            className="dashboard-modal-html"
            dangerouslySetInnerHTML={{
              __html: banner.nutrition_values || "",
            }}
          />
        </div>
        <div>
  <span className="font-semibold">Questions:</span>
  <div
    className="dashboard-modal-html"
    dangerouslySetInnerHTML={{
      __html: banner.questions || "",
    }}
  />
</div>
        {renderField("Zone 1", banner.zone1)}
        {renderField("Zone 2", banner.zone2)}
        {renderField("Zone 3", banner.zone3)}
        {renderField("Zone 4", banner.zone4)}
        {renderField(
          "Aroma IDs",
          Array.isArray(banner.aroma_ids)
            ? banner.aroma_ids.join(", ")
            : banner.aroma_ids
        )}
        {renderField("Titre", banner.title)}
        <div>
          <span className="font-semibold">Image:</span>
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            width={320}
            height={120}
            className="rounded mt-2"
            style={{ maxWidth: 320, maxHeight: 120 }}
            loading="lazy"
          />
        </div>
        {renderField(
          "Lien",
          <a
            href={banner.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {banner.linkUrl}
          </a>
        )}
        {renderField(
          "Actif",
          banner.isActive ? (
            <span className="text-green-600 font-semibold">Oui</span>
          ) : (
            <span className="text-red-600 font-semibold">Non</span>
          )
        )}
        {renderField("Créé le (frontend)", banner.createdAt)}
        {renderField("Mis à jour le (frontend)", banner.updatedAt)}
      </div>
    </Modal>
  );
};

export default BannerViewModal;