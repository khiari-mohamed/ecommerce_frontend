import React, { useState, useRef } from "react";
import { Product } from "@/types/product";
import Button from "../ui/Button";
import  Modal  from "../ui/Modal";
import { InputField } from "../ui/InputField";
import { TextArea } from "../ui/TextArea";
import  Switch  from "../ui/Switch";
import { createProduct, updateProduct } from "@/services/products";
import "../../styles/dashboard.css";
interface ProductFormModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave?: () => void; // Callback to refresh table
}

const defaultForm = {
  designation: "",
  price: "",
  oldPrice: "",
  smallDescription: "",
  brand: "",
  status: true,
  description: "",
  question: "",
  venteflashDate: "",
  categoryId: "",
  subCategoryIds: [],
  features: [],
  nutritionalValues: [],
  variant: [],
  codaBar: "",
  inStock: true,
};

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<any>(
    product
      ? {
          ...defaultForm,
          ...product,
          price: product.price?.toString() ?? "",
          oldPrice: product.oldPrice?.toString() ?? "",
        }
      : defaultForm
  );
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value, type } = e.target;
  if (type === "checkbox" && "checked" in e.target) {
    setForm((prev: any) => ({
      ...prev,
      [name]: (e.target as HTMLInputElement).checked,
    }));
  } else {
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        // Edit
        await updateProduct(product._id, form, mainImage, images);
      } else {
        // Add
        await createProduct(form, mainImage, images);
      }
      if (onSave) onSave();
      onClose();
    } catch (err) {
      // TODO: Show error toast
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="dashboard-modal dashboard-modal--fullscreen">
        <form onSubmit={handleSubmit} className="dashboard-modal-form">
          <h2>{product ? "Edit Product" : "Add Product"}</h2>
        <InputField
          label="Title"
          name="designation"
          value={form.designation}
          onChange={handleChange}
          required
        />
        <InputField
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          value={form.oldPrice}
          onChange={handleChange}
        />
        <InputField
          label="Brand"
          name="brand"
          value={form.brand}
          onChange={handleChange}
        />
        <label>
          Flavors / Aromas
          <select
            name="aroma_ids"
            multiple
            value={form.aroma_ids || []}
            onChange={e => {
              const options = Array.from(e.target.selectedOptions, option => option.value);
              setForm((prev: any) => ({ ...prev, aroma_ids: options }));
            }}
            style={{ minHeight: 60 }}
          >
            {/* TODO: Replace with dynamic aroma options */}
            <option value="citron">Citron</option>
            <option value="cassis">Cassis</option>
            <option value="fraise">Fraise</option>
            <option value="banane">Banane</option>
            <option value="ananas">Ananas</option>
            <option value="chocolat">Chocolat</option>
            <option value="vanilla">Vanilla</option>
            {/* Add more as needed */}
          </select>
        </label>
        <TextArea
          label="Short Description"
          name="smallDescription"
          value={form.smallDescription}
          onChange={handleChange}
        />
        <TextArea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <InputField
          label="Main Image"
          name="mainImage"
          type="file"
          accept="image/*"
          onChange={handleMainImageChange}
        />
        <InputField
          label="Gallery Images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
        />
        <Switch
          label="In Stock"
          checked={form.inStock}
          onChange={() => setForm((f: any) => ({ ...f, inStock: !f.inStock }))}
        />
        <Switch
          label="Published"
          checked={form.status}
          onChange={() => setForm((f: any) => ({ ...f, status: !f.status }))}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {product ? "Save Changes" : "Add Product"}
          </Button>
        </div>
        <label>
          Product Code
          <input type="text" name="code_product" value={form.code_product || ""} onChange={handleChange} />
        </label>
        <label>
          Designation (FR)
          <input type="text" name="designation_fr" value={form.designation_fr || ""} onChange={handleChange} />
        </label>
        <label>
          Subcategory ID
          <input type="text" name="sous_categorie_id" value={form.sous_categorie_id || ""} onChange={handleChange} />
        </label>
        <label>
          Cover Image
          <input type="text" name="cover" value={form.cover || ""} onChange={handleChange} />
        </label>
        <label>
          Quantity
          <input type="number" name="qte" value={form.qte || ""} onChange={handleChange} />
        </label>
        <label>
          Price HT
          <input type="number" name="prix_ht" value={form.prix_ht || ""} onChange={handleChange} />
        </label>
        <label>
          Price
          <input type="number" name="prix" value={form.prix || ""} onChange={handleChange} />
        </label>
        <label>
          Promo HT
          <input type="number" name="promo_ht" value={form.promo_ht || ""} onChange={handleChange} />
        </label>
        <label>
          Promo
          <input type="number" name="promo" value={form.promo || ""} onChange={handleChange} />
        </label>
        <label>
          Promo Expiration Date
          <input type="date" name="promo_expiration_date" value={form.promo_expiration_date || ""} onChange={handleChange} />
        </label>
        <label>
          Description (FR)
          <textarea name="description_fr" value={form.description_fr || ""} onChange={handleChange} />
        </label>
        <label>
          Published
          <input type="checkbox" name="publier" checked={form.publier === "1"} onChange={e => setForm({ ...form, publier: e.target.checked ? "1" : "0" })} />
        </label>
        <label>
          Slug
          <input type="text" name="slug" value={form.slug || ""} onChange={handleChange} />
        </label>
        <label>
          Pack
          <input type="text" name="pack" value={form.pack || ""} onChange={handleChange} />
        </label>
        <label>
          Brand ID
          <input type="text" name="brand_id" value={form.brand_id || ""} onChange={handleChange} />
        </label>
        <label>
          New Product
          <input type="checkbox" name="new_product" checked={form.new_product === "1"} onChange={e => setForm({ ...form, new_product: e.target.checked ? "1" : "0" })} />
        </label>
        <label>
          Best Seller
          <input type="checkbox" name="best_seller" checked={form.best_seller === "1"} onChange={e => setForm({ ...form, best_seller: e.target.checked ? "1" : "0" })} />
        </label>
        <label>
          Gallery
          <input type="text" name="gallery" value={form.gallery || ""} onChange={handleChange} />
        </label>
        <label>
          Note
          <input type="number" name="note" value={form.note || ""} onChange={handleChange} />
        </label>
        <label>
          Aggregate Rating
          <input type="number" name="aggregateRating" value={form.aggregateRating || ""} onChange={handleChange} min="0" max="5" step="0.1" />
        </label>
        <div style={{ margin: '8px 0' }}>
          <a href="/dashboard/review" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
            Manage Reviews for this Product
          </a>
        </div>
        <label>
          Meta Description (FR)
          <textarea name="meta_description_fr" value={form.meta_description_fr || ""} onChange={handleChange} />
        </label>
        <label>
          Alt Cover
          <input type="text" name="alt_cover" value={form.alt_cover || ""} onChange={handleChange} />
        </label>
        <label>
          Description Cover
          <input type="text" name="description_cover" value={form.description_cover || ""} onChange={handleChange} />
        </label>
        <label>
          Meta
          <input type="text" name="meta" value={form.meta || ""} onChange={handleChange} />
        </label>
        <label>
          Content SEO
          <textarea name="content_seo" value={form.content_seo || ""} onChange={handleChange} />
        </label>
        <label>
          Nutrition Values
          <textarea name="nutrition_values" value={form.nutrition_values || ""} onChange={handleChange} />
        </label>
        <label>
          Questions
          <textarea name="questions" value={form.questions || ""} onChange={handleChange} />
        </label>
        <label>
          Zone 1
          <input type="text" name="zone1" value={form.zone1 || ""} onChange={handleChange} />
        </label>
        <label>
          Zone 2
          <input type="text" name="zone2" value={form.zone2 || ""} onChange={handleChange} />
        </label>
        <label>
          Zone 3
          <input type="text" name="zone3" value={form.zone3 || ""} onChange={handleChange} />
        </label>
        <label>
          Zone 4
          <input type="text" name="zone4" value={form.zone4 || ""} onChange={handleChange} />
        </label>
        <label>
          Rupture
          <input type="checkbox" name="rupture" checked={form.rupture === "1"} onChange={e => setForm({ ...form, rupture: e.target.checked ? "1" : "0" })} />
        </label>
        <div className="dashboard-modal-actions">
          <button type="submit" disabled={loading}>
            {product ? "Update" : "Add"}
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
      </div>
    </>
  );
};

export default ProductFormModal;