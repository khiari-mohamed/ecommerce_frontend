import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Blog } from "../../../../../types/blog";
import { createBlog, updateBlog } from "../../../../../services/blog.service";
import "../../styles/dashboard.css";

interface Props {
  open: boolean;
  onClose: () => void;
  blog: Blog | null;
}

const BLOG_IMAGE_BASE = "/uploads/";

export default function BlogFormModal({ open, onClose, blog }: Props) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [publier, setPublier] = useState("1");
  const [description, setDescription] = useState("");
  const [meta, setMeta] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // New state variables for additional fields
  const [id, setId] = useState("");
  const [designationFr, setDesignationFr] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [metaDescriptionFr, setMetaDescriptionFr] = useState("");
  const [altCover, setAltCover] = useState("");
  const [descriptionCover, setDescriptionCover] = useState("");
  const [contentSeo, setContentSeo] = useState("");
  const [review, setReview] = useState("");
  const [aggregateRating, setAggregateRating] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(blog?.title || blog?.designation_fr || "");
      setSlug(blog?.slug || "");
      setPublier(blog?.publier || "1");
      setDescription(blog?.description || "");
      setMeta(blog?.meta || "");
      setImageFile(null);

      // New fields
      setId(blog?.id || "");
      setDesignationFr(blog?.designation_fr || "");
      setCreatedAt(blog?.created_at || "");
      setUpdatedAt(blog?.updated_at || "");
      setMetaDescriptionFr(blog?.meta_description_fr || "");
      setAltCover(blog?.alt_cover || "");
      setDescriptionCover(blog?.description_cover || "");
      setContentSeo(blog?.content_seo || "");
      setReview(blog?.review || "");
      setAggregateRating(blog?.aggregateRating || "");

      // Show current image if editing
      if (blog?.cover) {
        if (typeof blog.cover === "string") {
          setImagePreview(
            blog.cover.startsWith("http")
              ? blog.cover
              : BLOG_IMAGE_BASE + blog.cover.replace(/^\/+/, "")
          );
        } else if (blog.cover.url) {
          setImagePreview(
            blog.cover.url.startsWith("http")
              ? blog.cover.url
              : BLOG_IMAGE_BASE + blog.cover.url.replace(/^\/+/, "")
          );
        }
      } else {
        setImagePreview(null);
      }
    }
  }, [open, blog]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("publier", publier);
      formData.append("description", description);
      formData.append("meta", meta);
      formData.append("designation_fr", designationFr);
      formData.append("meta_description_fr", metaDescriptionFr);
      formData.append("alt_cover", altCover);
      formData.append("description_cover", descriptionCover);
      formData.append("content_seo", contentSeo);
      formData.append("review", review);
      formData.append("aggregateRating", aggregateRating);
      if (imageFile) {
        formData.append("cover", imageFile);
      }
      if (blog && blog._id) {
        await updateBlog(blog._id, formData, true); // true = isFormData
      } else {
        await createBlog(formData, true);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="dashboard-modal dashboard-modal--fullscreen">
      <form className="dashboard-modal-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>{blog ? "Modifier le blog" : "Ajouter un blog"}</h2>
        <label>
          Titre
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Titre du blog"
          />
        </label>
        <label>
          Slug
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="Slug"
          />
        </label>
        <label>
          Publié
          <select value={publier} onChange={(e) => setPublier(e.target.value)}>
            <option value="1">Oui</option>
            <option value="0">Non</option>
          </select>
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
          />
        </label>
        <label>
          Meta
          <textarea
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            placeholder="Meta"
            rows={2}
          />
        </label>
        <label>
          Désignation FR
          <input
            value={designationFr}
            onChange={(e) => setDesignationFr(e.target.value)}
            placeholder="Désignation FR"
          />
        </label>
        <label>
          Meta Description FR
          <textarea
            value={metaDescriptionFr}
            onChange={(e) => setMetaDescriptionFr(e.target.value)}
            placeholder="Meta Description FR"
            rows={2}
          />
        </label>
        <label>
          Alt Cover
          <input
            value={altCover}
            onChange={(e) => setAltCover(e.target.value)}
            placeholder="Alt Cover"
          />
        </label>
        <label>
          Description Cover
          <textarea
            value={descriptionCover}
            onChange={(e) => setDescriptionCover(e.target.value)}
            placeholder="Description Cover"
            rows={2}
          />
        </label>
        <label>
          Content SEO
          <textarea
            value={contentSeo}
            onChange={(e) => setContentSeo(e.target.value)}
            placeholder="Content SEO"
            rows={2}
          />
        </label>
        <label>
          Review
          <input
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Review"
          />
        </label>
        <label>
          Aggregate Rating
          <input
            value={aggregateRating}
            onChange={(e) => setAggregateRating(e.target.value)}
            placeholder="Aggregate Rating"
          />
        </label>
        <label>
          Image de couverture
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        {imagePreview && (
          <div style={{ marginBottom: 12 }}>
            <Image
              src={imagePreview}
              alt="Aperçu"
              width={120}
              height={80}
              style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 4 }}
              loading="lazy"
            />
          </div>
        )}
        {/* System fields only in edit mode */}
        {blog && (
          <>
            <label>
              ID
              <input value={id} disabled />
            </label>
            <label>
              Créé le
              <input value={createdAt} disabled />
            </label>
            <label>
              Modifié le
              <input value={updatedAt} disabled />
            </label>
          </>
        )}
        <div className="dashboard-modal-actions">
          <button type="submit" disabled={loading}>
            {blog ? "Mettre à jour" : "Créer"}
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}