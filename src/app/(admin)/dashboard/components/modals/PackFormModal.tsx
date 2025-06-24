import React, { useEffect, useState } from "react";
import { Pack } from "../../../../../types/pack";
import { createPack, updatePack } from "../../../../../services/pack";
import { getAllSubCategories } from "../../../../../services/subcategories";
import "../../styles/dashboard.css";
interface Props {
  open: boolean;
  onClose: () => void;
  pack: Pack | null;
}

export default function PackFormModal({ open, onClose, pack }: Props) {
  const [designation_fr, setDesignationFr] = useState("");
  const [prix, setPrix] = useState("");
  const [prix_ht, setPrixHt] = useState("");
  const [promo, setPromo] = useState("");
  const [promo_ht, setPromoHt] = useState("");
  const [qte, setQte] = useState("");
  const [publier, setPublier] = useState("1");
  const [sous_categorie_id, setSousCategorieId] = useState("");
  const [cover, setCover] = useState("");
  const [description_fr, setDescriptionFr] = useState("");
  const [code_product, setCodeProduct] = useState("");
  const [slug, setSlug] = useState("");
  const [packField, setPackField] = useState("1");
  const [brand_id, setBrandId] = useState("");
  const [new_product, setNewProduct] = useState("0");
  const [best_seller, setBestSeller] = useState("0");
  const [gallery, setGallery] = useState("[]");
  const [note, setNote] = useState("");
  const [meta_description_fr, setMetaDescriptionFr] = useState("");
  const [promo_expiration_date, setPromoExpirationDate] = useState("");
  const [rupture, setRupture] = useState("0");
  const [alt_cover, setAltCover] = useState("");
  const [description_cover, setDescriptionCover] = useState("");
  const [meta, setMeta] = useState("");
  const [content_seo, setContentSeo] = useState("");
  const [review, setReview] = useState("");
  const [aggregateRating, setAggregateRating] = useState("");
  const [nutrition_values, setNutritionValues] = useState("");
  const [questions, setQuestions] = useState("");
  const [zone1, setZone1] = useState("");
  const [zone2, setZone2] = useState("");
  const [zone3, setZone3] = useState("");
  const [zone4, setZone4] = useState("");
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setDesignationFr(pack?.designation_fr || "");
      setPrix(pack?.prix || "");
      setPrixHt(pack?.prix_ht || "");
      setPromo(pack?.promo || "");
      setPromoHt(pack?.promo_ht || "");
      setQte(pack?.qte || "");
      setPublier(pack?.publier || "1");
      setSousCategorieId(pack?.sous_categorie_id || "");
      setCover(pack?.cover || "");
      setDescriptionFr(pack?.description_fr || "");
      setCodeProduct(pack?.code_product || "");
      setSlug(pack?.slug || "");
      setPackField(pack?.pack || "1");
      setBrandId(pack?.brand_id || "");
      setNewProduct(pack?.new_product || "0");
      setBestSeller(pack?.best_seller || "0");
      setGallery(pack?.gallery || "[]");
      setNote(pack?.note || "");
      setMetaDescriptionFr(pack?.meta_description_fr || "");
      setPromoExpirationDate(pack?.promo_expiration_date || "");
      setRupture(pack?.rupture || "0");
      setAltCover(pack?.alt_cover || "");
      setDescriptionCover(pack?.description_cover || "");
      setMeta(pack?.meta || "");
      setContentSeo(pack?.content_seo || "");
      setReview(pack?.review || "");
      setAggregateRating(pack?.aggregateRating || "");
      setNutritionValues(pack?.nutrition_values || "");
      setQuestions(pack?.questions || "");
      setZone1(pack?.zone1 || "");
      setZone2(pack?.zone2 || "");
      setZone3(pack?.zone3 || "");
      setZone4(pack?.zone4 || "");
      getAllSubCategories().then(setSubcategories);
    }
  }, [open, pack]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        designation_fr,
        prix,
        prix_ht,
        promo,
        promo_ht,
        qte,
        publier,
        sous_categorie_id,
        cover,
        description_fr,
        code_product,
        slug,
        pack: packField,
        brand_id,
        new_product,
        best_seller,
        gallery,
        note,
        meta_description_fr,
        promo_expiration_date,
        rupture,
        alt_cover,
        description_cover,
        meta,
        content_seo,
        review,
        aggregateRating,
        nutrition_values,
        questions,
        zone1,
        zone2,
        zone3,
        zone4,
      };
      if (pack && pack._id) {
        await updatePack(pack._id, payload);
      } else {
        await createPack(payload);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="dashboard-modal dashboard-modal--fullscreen">
      <form className="dashboard-modal-form" onSubmit={handleSubmit}>
        <h2>{pack ? "Edit Pack" : "Add Pack"}</h2>
        <label>
          Name
          <input
            value={designation_fr}
            onChange={(e) => setDesignationFr(e.target.value)}
            required
            placeholder="Pack Name"
          />
        </label>
        <label>
          Price
          <input
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            required
            placeholder="Price"
            type="number"
            min="0"
          />
        </label>
        <label>
          Price HT
          <input
            value={prix_ht}
            onChange={(e) => setPrixHt(e.target.value)}
            placeholder="Price HT"
            type="number"
            min="0"
          />
        </label>
        <label>
          Promo
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Promo Price"
            type="number"
            min="0"
          />
        </label>
        <label>
          Promo HT
          <input
            value={promo_ht}
            onChange={(e) => setPromoHt(e.target.value)}
            placeholder="Promo HT"
            type="number"
            min="0"
          />
        </label>
        <label>
          Quantity
          <input
            value={qte}
            onChange={(e) => setQte(e.target.value)}
            required
            placeholder="Quantity"
            type="number"
            min="0"
          />
        </label>
        <label>
          Subcategory
          <select
            value={sous_categorie_id}
            onChange={(e) => setSousCategorieId(e.target.value)}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name || sub.designation || sub.designation_fr}
              </option>
            ))}
          </select>
        </label>
        <label>
          Cover
          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            placeholder="Cover image path"
          />
        </label>
        <label>
          Description FR
          <textarea
            value={description_fr}
            onChange={(e) => setDescriptionFr(e.target.value)}
            placeholder="Description (FR)"
          />
        </label>
        <label>
          Code Product
          <input
            value={code_product}
            onChange={(e) => setCodeProduct(e.target.value)}
            placeholder="Code Product"
          />
        </label>
        <label>
          Slug
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug"
          />
        </label>
        <label>
          Pack
          <input
            value={packField}
            onChange={(e) => setPackField(e.target.value)}
            placeholder="Pack"
          />
        </label>
        <label>
          Brand ID
          <input
            value={brand_id}
            onChange={(e) => setBrandId(e.target.value)}
            placeholder="Brand ID"
          />
        </label>
        <label>
          New Product
          <select
            value={new_product}
            onChange={(e) => setNewProduct(e.target.value)}
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </label>
        <label>
          Best Seller
          <select
            value={best_seller}
            onChange={(e) => setBestSeller(e.target.value)}
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </label>
        <label>
          Gallery (JSON)
          <textarea
            value={gallery}
            onChange={(e) => setGallery(e.target.value)}
            placeholder="Gallery (JSON array)"
          />
        </label>
        <label>
          Note
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note"
          />
        </label>
        <label>
          Meta Description FR
          <textarea
            value={meta_description_fr}
            onChange={(e) => setMetaDescriptionFr(e.target.value)}
            placeholder="Meta Description (FR)"
          />
        </label>
        <label>
          Promo Expiration Date
          <input
            value={promo_expiration_date}
            onChange={(e) => setPromoExpirationDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            type="date"
          />
        </label>
        <label>
          Rupture
          <select
            value={rupture}
            onChange={(e) => setRupture(e.target.value)}
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </label>
        <label>
          Alt Cover
          <input
            value={alt_cover}
            onChange={(e) => setAltCover(e.target.value)}
            placeholder="Alt Cover"
          />
        </label>
        <label>
          Description Cover
          <textarea
            value={description_cover}
            onChange={(e) => setDescriptionCover(e.target.value)}
            placeholder="Description Cover"
          />
        </label>
        <label>
          Meta
          <textarea
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            placeholder="Meta"
          />
        </label>
        <label>
          Content SEO
          <textarea
            value={content_seo}
            onChange={(e) => setContentSeo(e.target.value)}
            placeholder="Content SEO"
          />
        </label>
        <label>
          Review (JSON)
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Review (JSON array)"
          />
        </label>
        <label>
          Aggregate Rating (JSON)
          <textarea
            value={aggregateRating}
            onChange={(e) => setAggregateRating(e.target.value)}
            placeholder="Aggregate Rating (JSON)"
          />
        </label>
        <label>
          Nutrition Values
          <textarea
            value={nutrition_values}
            onChange={(e) => setNutritionValues(e.target.value)}
            placeholder="Nutrition Values"
          />
        </label>
        <label>
          Questions
          <textarea
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Questions"
          />
        </label>
        <label>
          Zone 1
          <input
            value={zone1}
            onChange={(e) => setZone1(e.target.value)}
            placeholder="Zone 1"
          />
        </label>
        <label>
          Zone 2
          <input
            value={zone2}
            onChange={(e) => setZone2(e.target.value)}
            placeholder="Zone 2"
          />
        </label>
        <label>
          Zone 3
          <input
            value={zone3}
            onChange={(e) => setZone3(e.target.value)}
            placeholder="Zone 3"
          />
        </label>
        <label>
          Zone 4
          <input
            value={zone4}
            onChange={(e) => setZone4(e.target.value)}
            placeholder="Zone 4"
          />
        </label>
        <label>
          Published
          <select
            value={publier}
            onChange={(e) => setPublier(e.target.value)}
          >
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </label>
        <div className="dashboard-modal-actions">
          <button type="submit" disabled={loading}>
            {pack ? "Update" : "Create"}
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}