import React, { useState } from "react";
import { Category } from "@/types/category";
import "../../styles/dashboard.css";
interface Props {
  category: Category | null;
  onClose: () => void;
  onSave: (
    data: {
      designation: string;
      slug: string;
      designation_fr?: string;
      description_fr?: string;
      alt_cover?: string;
      description_cover?: string;
      meta?: string;
      content_seo?: string;
      review?: string;
      aggregateRating?: string;
      nutrition_values?: string;
      questions?: string;
      more_details?: string;
      zone1?: string;
      zone2?: string;
      zone3?: string;
    },
    image?: File | null
  ) => void;
}

const CategoryFormModal: React.FC<Props> = ({ category, onClose, onSave }) => {
  const [designation, setDesignation] = useState(category?.designation || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [image, setImage] = useState<File | null>(null);

  // Extra fields for both add and edit
  const [designationFr, setDesignationFr] = useState(category?.designation_fr || "");
  const [descriptionFr, setDescriptionFr] = useState(category?.description_fr || "");
  const [altCover, setAltCover] = useState(category?.alt_cover || "");
  const [descriptionCover, setDescriptionCover] = useState(category?.description_cover || "");
  const [meta, setMeta] = useState(category?.meta || "");
  const [contentSeo, setContentSeo] = useState(category?.content_seo || "");
  const [review, setReview] = useState(category?.review || "");
  const [aggregateRating, setAggregateRating] = useState(category?.aggregateRating || "");
  const [nutritionValues, setNutritionValues] = useState(category?.nutrition_values || "");
  const [questions, setQuestions] = useState(category?.questions || "");
  const [moreDetails, setMoreDetails] = useState(category?.more_details || "");
  const [zone1, setZone1] = useState(category?.zone1 || "");
  const [zone2, setZone2] = useState(category?.zone2 || "");
  const [zone3, setZone3] = useState(category?.zone3 || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        designation,
        slug,
        designation_fr: designationFr,
        description_fr: descriptionFr,
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
      },
      image
    );
  };

  return (
    <div className="dashboard-modal dashboard-modal--fullscreen">
      <form onSubmit={handleSubmit} className="dashboard-modal-form">
        <h2>{category ? "Edit Category" : "Add Category"}</h2>
        <label>
          Name
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
          />
        </label>
        <label>
          Slug
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </label>
        <label>
          Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
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
        {category && (
          <>
            <label>
              MongoDB _id
              <input type="text" value={category._id} disabled />
            </label>
            <label>
              ID
              <input type="text" value={category.id || ""} disabled />
            </label>
            <label>
              Created By
              <input type="text" value={category.created_by || ""} disabled />
            </label>
            <label>
              Updated By
              <input type="text" value={category.updated_by || ""} disabled />
            </label>
            <label>
              Created At
              <input type="text" value={category.createdAt ? String(category.createdAt) : ""} disabled />
            </label>
            <label>
              Updated At
              <input type="text" value={category.updatedAt ? String(category.updatedAt) : ""} disabled />
            </label>
            <label>
              Cover
              <input type="text" value={category.cover || ""} disabled />
            </label>
            <label>
              Product Liste Cover
              <input type="text" value={category.product_liste_cover || ""} disabled />
            </label>
          </>
        )}

        <div className="dashboard-modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">
            {category ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryFormModal;