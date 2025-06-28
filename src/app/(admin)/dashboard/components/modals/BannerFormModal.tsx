import React, { useState, useEffect } from "react";
import { Banner } from "@/types/banner";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import "../../styles/dashboard.css";

// Helper: get default values for a new Banner
const getDefaultBanner = (): Partial<Banner> => ({
  id: "",
  sous_categorie_id: "",
  designation_fr: "",
  cover: "",
  qte: "",
  prix_ht: null,
  prix: "",
  promo_ht: null,
  promo: "",
  description_fr: "",
  publier: "1",
  created_by: null,
  updated_by: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  code_product: "",
  slug: "",
  pack: "",
  brand_id: null,
  new_product: "0",
  best_seller: "0",
  gallery: "",
  note: "",
  meta_description_fr: "",
  promo_expiration_date: null,
  rupture: "0",
  alt_cover: null,
  description_cover: null,
  meta: "",
  content_seo: null,
  review: null,
  aggregateRating: null,
  nutrition_values: "",
  questions: "",
  zone1: "",
  zone2: "",
  zone3: "",
  zone4: "",
  aroma_ids: null,
  title: "",
  imageUrl: "",
  linkUrl: "",
  isActive: true,
});

interface BannerFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (banner: Partial<Banner>) => void;
  initialData?: Partial<Banner> | null;
}

const BannerFormModal: React.FC<BannerFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState<Partial<Banner>>(getDefaultBanner());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setForm({ ...getDefaultBanner(), ...initialData });
    } else {
      setForm(getDefaultBanner());
    }
    setErrors({});
  }, [initialData, open]);

  // Validate required fields
  const validate = () => {
    // Only require the most important fields for banners
    const requiredFields = [
      "title",
      "imageUrl",
      "linkUrl",
      "prix",
      "promo",
      "description_fr",
      "isActive",
    ];
    const newErrors: { [key: string]: string } = {};
    requiredFields.forEach((field) => {
      if (
        form[field as keyof Banner] === undefined ||
        form[field as keyof Banner] === null ||
        form[field as keyof Banner] === ""
      ) {
        newErrors[field] = "Ce champ est requis";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({
        ...prev,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value.trim() === "" ? null : value.split(",").map((v) => v.trim()),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...(initialData?._id ? { _id: initialData._id } : {}),
      ...form,
    });
  };

  if (!open) return null;

  return (
    <div className="banner-modal dashboard-modal--fullscreen product-edit-modal">
      <Modal
  open={open}
  onClose={onClose}
  title={initialData ? "Modifier le banner" : "Ajouter un banner"}
  className="product-edit-modal"
  size="lg"
>
        <form
          onSubmit={handleSubmit}
          className="product-edit-form"
        >
          {/* Section: Principales */}
          <div className="form-row">
            <div className="form-group">
              <label>Titre *</label>
              <input
                type="text"
                name="title"
                value={form.title || ""}
                onChange={handleChange}
                required
              />
              {errors.title && <span className="text-red-500">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label>Image URL *</label>
              <input
                type="text"
                name="imageUrl"
                value={form.imageUrl || ""}
                onChange={handleChange}
                required
              />
              {errors.imageUrl && <span className="text-red-500">{errors.imageUrl}</span>}
            </div>
            <div className="form-group">
              <label>Lien *</label>
              <input
                type="text"
                name="linkUrl"
                value={form.linkUrl || ""}
                onChange={handleChange}
                required
              />
              {errors.linkUrl && <span className="text-red-500">{errors.linkUrl}</span>}
            </div>
            <div className="form-group">
              <label>Actif</label>
              <input
                type="checkbox"
                name="isActive"
                checked={!!form.isActive}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Section: Prix & Promo */}
          <div className="form-row">
            <div className="form-group">
              <label>Prix *</label>
              <input
                type="text"
                name="prix"
                value={form.prix || ""}
                onChange={handleChange}
                required
              />
              {errors.prix && <span className="text-red-500">{errors.prix}</span>}
            </div>
            <div className="form-group">
              <label>Promo *</label>
              <input
                type="text"
                name="promo"
                value={form.promo || ""}
                onChange={handleChange}
                required
              />
              {errors.promo && <span className="text-red-500">{errors.promo}</span>}
            </div>
            <div className="form-group">
              <label>Prix HT</label>
              <input
                type="text"
                name="prix_ht"
                value={form.prix_ht || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Promo HT</label>
              <input
                type="text"
                name="promo_ht"
                value={form.promo_ht || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Section: Description */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Description (FR) *</label>
              <textarea
                name="description_fr"
                value={form.description_fr || ""}
                onChange={handleChange}
                required
                rows={3}
              />
              {errors.description_fr && <span className="text-red-500">{errors.description_fr}</span>}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Meta description (FR)</label>
              <input
                type="text"
                name="meta_description_fr"
                value={form.meta_description_fr || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Section: Infos techniques */}
          <div className="form-row">
            <div className="form-group">
              <label>ID</label>
              <input type="text" name="id" value={form.id || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Sous-catégorie ID</label>
              <input type="text" name="sous_categorie_id" value={form.sous_categorie_id || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Code produit</label>
              <input type="text" name="code_product" value={form.code_product || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input type="text" name="slug" value={form.slug || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Pack</label>
              <input type="text" name="pack" value={form.pack || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Brand ID</label>
              <input type="text" name="brand_id" value={form.brand_id || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Galerie</label>
              <input type="text" name="gallery" value={form.gallery || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Note</label>
              <input type="text" name="note" value={form.note || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Alt cover</label>
              <input type="text" name="alt_cover" value={form.alt_cover || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Description cover</label>
              <input type="text" name="description_cover" value={form.description_cover || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Meta</label>
              <input type="text" name="meta" value={form.meta || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Content SEO</label>
              <input type="text" name="content_seo" value={form.content_seo || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Review</label>
              <input type="text" name="review" value={form.review || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Aggregate Rating</label>
              <input type="text" name="aggregateRating" value={form.aggregateRating || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Expiration promo</label>
              <input type="text" name="promo_expiration_date" value={form.promo_expiration_date || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Valeurs nutritionnelles</label>
              <input type="text" name="nutrition_values" value={form.nutrition_values || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Questions</label>
              <input type="text" name="questions" value={form.questions || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Zone 1</label>
              <input type="text" name="zone1" value={form.zone1 || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Zone 2</label>
              <input type="text" name="zone2" value={form.zone2 || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Zone 3</label>
              <input type="text" name="zone3" value={form.zone3 || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Zone 4</label>
              <input type="text" name="zone4" value={form.zone4 || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Aroma IDs (séparés par des virgules)</label>
              <input
                type="text"
                name="aroma_ids"
                value={Array.isArray(form.aroma_ids) ? form.aroma_ids.join(", ") : ""}
                onChange={handleArrayChange}
              />
            </div>
          </div>
          {/* Section: Statut & Dates */}
          <div className="form-row">
            <div className="form-group">
              <label>Publier</label>
              <input type="text" name="publier" value={form.publier || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Nouveau produit</label>
              <input type="text" name="new_product" value={form.new_product || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Best seller</label>
              <input type="text" name="best_seller" value={form.best_seller || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Rupture</label>
              <input type="text" name="rupture" value={form.rupture || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Créé le</label>
              <input type="text" name="created_at" value={form.created_at || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Modifié le</label>
              <input type="text" name="updated_at" value={form.updated_at || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Créé par</label>
              <input type="text" name="created_by" value={form.created_by || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Modifié par</label>
              <input type="text" name="updated_by" value={form.updated_by || ""} onChange={handleChange} />
            </div>
          </div>
          {/* Actions */}
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              {initialData ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BannerFormModal;