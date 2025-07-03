import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Brand } from "@/types/brand";
import "../../styles/dashboard.css";
// If you need staticBrands, fix the import path as needed:
// import { brands as staticBrands } from "../../components/Home/BrandSection/brandData";

interface BrandsFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  brand: Brand | null;
  onClose: () => void;
  onSubmit: (brand: Brand) => void;
}

const initialBrand: Partial<Brand> = {
  designation_fr: "",
  logo: "",
  description_fr: "",
  alt_cover: "",
  description_cover: "",
  meta: "",
  content_seo: "",
  review: "",
  aggregateRating: "",
  nutrition_values: "",
  questions: "",
  more_details: "",
  aromas: [],
};

// Always resolve the correct logo path for preview
function getBrandLogoPath(brand: Brand | null): string | null {
  if (!brand) return null;
  if (brand.id) {
    const imgIndex = Number(brand.id) - 36;
    if (imgIndex > 0 && imgIndex <= 27) {
      return `/images/brand/${imgIndex}.webp`;
    }
  }
  return null;
}

const BrandsFormModal: React.FC<BrandsFormModalProps> = ({
  open,
  mode,
  brand,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<Partial<Brand>>(initialBrand);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && brand) {
        setForm(brand);
        setLogoPreview(getBrandLogoPath(brand));
        setUploadedLogo(null);
      } else {
        setForm(initialBrand);
        setLogoPreview(null);
        setUploadedLogo(null);
      }
    }
  }, [open, mode, brand]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // For logo upload (simulate, actual upload logic should be implemented)
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, logo: url }));
      setLogoPreview(url);
      setUploadedLogo(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If a new logo was uploaded, you should handle the upload here.
    // For now, just pass the form data.
    // @ts-ignore
    onSubmit(form as Brand);
  };

  // Always show the uploaded logo if present, otherwise resolve from brand data
  const effectiveLogoPreview =
    uploadedLogo && logoPreview
      ? logoPreview
      : mode === "edit" && brand
      ? getBrandLogoPath(brand)
      : null;

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal brands-form-modal dashboard-modal--fullscreen">
        <div className="modal-header">
          <h2>{mode === "add" ? "Ajouter une marque" : "Modifier la marque"}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom (FR)</label>
            <input
              name="designation_fr"
              value={form.designation_fr || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoChange} />
            {(logoPreview || effectiveLogoPreview) && (
              <Image
                src={logoPreview || effectiveLogoPreview || ""}
                alt="Logo"
                width={120}
                height={60}
                className="brand-logo-preview"
                style={{
                  width: 120,
                  height: 60,
                  objectFit: "contain",
                  background: "#fff",
                  border: "1px solid #eee",
                  marginTop: 8,
                }}
                loading="lazy"
              />
            )}
          </div>
          <div className="form-group">
            <label>Description (FR)</label>
            <textarea
              name="description_fr"
              value={form.description_fr || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Alt Cover</label>
            <input
              name="alt_cover"
              value={form.alt_cover || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Description Cover</label>
            <textarea
              name="description_cover"
              value={form.description_cover || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>Meta</label>
            <input
              name="meta"
              value={form.meta || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Contenu SEO</label>
            <textarea
              name="content_seo"
              value={form.content_seo || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>Review</label>
            <textarea
              name="review"
              value={form.review || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>Aggregate Rating</label>
            <input
              name="aggregateRating"
              value={form.aggregateRating || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Nutrition Values</label>
            <textarea
              name="nutrition_values"
              value={form.nutrition_values || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>Questions</label>
            <textarea
              name="questions"
              value={form.questions || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>Plus de détails</label>
            <textarea
              name="more_details"
              value={form.more_details || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>
          {/* System fields only in edit mode */}
          {mode === "edit" && brand && (
            <>
              <div className="form-group">
                <label>ID</label>
                <input value={brand.id || brand._id || ""} disabled />
              </div>
              <div className="form-group">
                <label>Créé le</label>
                <input value={brand.created_at || ""} disabled />
              </div>
              <div className="form-group">
                <label>Modifié le</label>
                <input value={brand.updated_at || ""} disabled />
              </div>
            </>
          )}
          <div className="modal-footer">
            <button type="submit" className="btn-primary">
              {mode === "add" ? "Ajouter" : "Enregistrer"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandsFormModal;