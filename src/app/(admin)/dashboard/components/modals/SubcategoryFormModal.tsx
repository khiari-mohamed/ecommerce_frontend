import React, { useEffect, useState } from "react";
import { createSubCategory, updateSubCategory } from "../../../../../services/subcategories";
import { SubCategory } from "../../../../../types/subcategory";
import { getCategories } from "../../../../../services/categories";
import "../../styles/dashboard.css";
interface Props {
  open: boolean;
  onClose: () => void;
  subcategory: SubCategory | null;
}

export default function SubcategoryFormModal({ open, onClose, subcategory }: Props) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Extra fields for both add and edit
  const [designationFr, setDesignationFr] = useState(subcategory?.designation_fr || "");
  const [descriptionFr, setDescriptionFr] = useState(subcategory?.description_fr || "");
  const [slug, setSlug] = useState(subcategory?.slug || "");
  const [altCover, setAltCover] = useState(subcategory?.alt_cover || "");
  const [descriptionCover, setDescriptionCover] = useState(subcategory?.description_cove || "");
  const [meta, setMeta] = useState(subcategory?.meta || "");
  const [contentSeo, setContentSeo] = useState(subcategory?.content_seo || "");
  const [review, setReview] = useState(subcategory?.review || "");
  const [aggregateRating, setAggregateRating] = useState(subcategory?.aggregateRating || "");
  const [nutritionValues, setNutritionValues] = useState(subcategory?.nutrition_values || "");
  const [questions, setQuestions] = useState(subcategory?.questions || "");
  const [moreDetails, setMoreDetails] = useState(subcategory?.more_details || "");
  const [zone1, setZone1] = useState(subcategory?.zone1 || "");
  const [zone2, setZone2] = useState(subcategory?.zone2 || "");
  const [zone3, setZone3] = useState(subcategory?.zone3 || "");

  useEffect(() => {
    if (open) {
      setName(subcategory?.name || subcategory?.designation || "");
      setCategoryId(
        typeof subcategory?.category === "string"
          ? subcategory.category
          : subcategory?.category?._id || ""
      );
      setDesignationFr(subcategory?.designation_fr || "");
      setDescriptionFr(subcategory?.description_fr || "");
      setSlug(subcategory?.slug || "");
      setAltCover(subcategory?.alt_cover || "");
      setDescriptionCover(subcategory?.description_cove || "");
      setMeta(subcategory?.meta || "");
      setContentSeo(subcategory?.content_seo || "");
      setReview(subcategory?.review || "");
      setAggregateRating(subcategory?.aggregateRating || "");
      setNutritionValues(subcategory?.nutrition_values || "");
      setQuestions(subcategory?.questions || "");
      setMoreDetails(subcategory?.more_details || "");
      setZone1(subcategory?.zone1 || "");
      setZone2(subcategory?.zone2 || "");
      setZone3(subcategory?.zone3 || "");
      getCategories().then(setCategories);
    }
  }, [open, subcategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name,
        categoryId,
        designation_fr: designationFr,
        description_fr: descriptionFr,
        slug,
        alt_cover: altCover,
        description_cover: descriptionCover,
        meta,
        content_seo: contentSeo,
        review,
        aggregateRating,
        nutrition_values: nutritionValues,
        questions,
        more_details: moreDetails,
        zone1,
        zone2,
        zone3,
      };
      if (subcategory && subcategory._id) {
        await updateSubCategory(subcategory._id, data);
      } else {
        await createSubCategory(data);
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
        <h2>{subcategory ? "Edit Subcategory" : "Add Subcategory"}</h2>
        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Subcategory Name"
          />
        </label>
        <label>
          Category
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name || cat.designation}
              </option>
            ))}
          </select>
        </label>
        <label>
          Slug
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </label>
        <label>
          Designation FR
          <input
            type="text"
            value={designationFr}
            onChange={(e) => setDesignationFr(e.target.value)}
          />
        </label>
        <label>
          Description FR
          <textarea
            value={descriptionFr}
            onChange={(e) => setDescriptionFr(e.target.value)}
            rows={2}
          />
        </label>
        <label>
          Alt Cover
          <input
            type="text"
            value={altCover}
            onChange={(e) => setAltCover(e.target.value)}
          />
        </label>
        <label>
          Description Cover
          <textarea
            value={descriptionCover}
            onChange={(e) => setDescriptionCover(e.target.value)}
            rows={2}
          />
        </label>
        <label>
          Meta
          <textarea
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            rows={2}
          />
        </label>
        <label>
          Content SEO
          <textarea
            value={contentSeo}
            onChange={(e) => setContentSeo(e.target.value)}
            rows={2}
          />
        </label>
        <label>
          Review
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={2}
          />
        </label>
        <label>
          Aggregate Rating
          <textarea
            value={aggregateRating}
            onChange={(e) => setAggregateRating(e.target.value)}
            rows={2}
          />
        </label>
        <label>
          Nutrition Values
          <textarea
            value={nutritionValues}
            onChange={(e) => setNutritionValues(e.target.value)}
            rows={2}
          />
        </label>
        <label>
          Questions
          <textarea
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            rows={2}
          />
        </label>
        <label>
          More Details
          <textarea
            value={moreDetails}
            onChange={(e) => setMoreDetails(e.target.value)}
            rows={2}
          />
        </label>
        <label>
          Zone 1
          <input
            type="text"
            value={zone1}
            onChange={(e) => setZone1(e.target.value)}
          />
        </label>
        <label>
          Zone 2
          <input
            type="text"
            value={zone2}
            onChange={(e) => setZone2(e.target.value)}
          />
        </label>
        <label>
          Zone 3
          <input
            type="text"
            value={zone3}
            onChange={(e) => setZone3(e.target.value)}
          />
        </label>

        {/* System fields only in edit mode */}
        {subcategory && (
          <>
            <label>
              MongoDB _id
              <input type="text" value={subcategory._id} disabled />
            </label>
            <label>
              ID
              <input type="text" value={subcategory.id || ""} disabled />
            </label>
            <label>
              Created By
              <input type="text" value={subcategory.created_by || ""} disabled />
            </label>
            <label>
              Updated By
              <input type="text" value={subcategory.updated_by || ""} disabled />
            </label>
            <label>
              Created At
              <input type="text" value={subcategory.createdAt || ""} disabled />
            </label>
            <label>
              Updated At
              <input type="text" value={subcategory.updatedAt || ""} disabled />
            </label>
          </>
        )}

        <div className="dashboard-modal-actions">
          <button type="submit" disabled={loading}>
            {subcategory ? "Update" : "Create"}
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}