import React, { useEffect, useState } from "react";
import { VenteFlash } from "../../../../../types/venteFlash";
import { createVenteFlash, updateVenteFlash } from "../../../../../services/venteFlash";
import { getAllProducts } from "../../../../../services/products"; // You need to implement this service
import "../../styles/dashboard.css";
interface Props {
  open: boolean;
  onClose: () => void;
  venteFlash: VenteFlash | null;
}

export default function VenteFlashFormModal({ open, onClose, venteFlash }: Props) {
  const [designation_fr, setDesignationFr] = useState("");
  const [slug, setSlug] = useState("");
  const [publier, setPublier] = useState("1");
  const [description, setDescription] = useState("");
  const [sort_order, setSortOrder] = useState<number | "">("");
  const [cover, setCover] = useState("");
  const [endTime, setEndTime] = useState("");
  const [discount, setDiscount] = useState<number | "">("");
  const [products, setProducts] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setDesignationFr(venteFlash?.designation_fr || "");
      setSlug(venteFlash?.slug || "");
      setPublier(venteFlash?.publier || "1");
      setDescription(venteFlash?.description || "");
      setSortOrder(
        venteFlash?.sort_order !== undefined && venteFlash?.sort_order !== null
          ? Number(venteFlash.sort_order)
          : ""
      );
      setCover(venteFlash?.cover || "");
      setEndTime(
        venteFlash?.endTime
          ? new Date(venteFlash.endTime).toISOString().slice(0, 16)
          : ""
      );
      setDiscount(
        venteFlash?.discount !== undefined && venteFlash?.discount !== null
          ? Number(venteFlash.discount)
          : ""
      );
      setProducts(
        venteFlash && Array.isArray(venteFlash.products)
          ? (venteFlash.products as unknown as any[]).map(String)
          : []
      );
      getAllProducts().then((products) => setAllProducts(products || []));
    }
  }, [open, venteFlash]);

  const handleProductToggle = (id: string) => {
    setProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        designation_fr,
        slug,
        publier,
        description,
        sort_order: sort_order === "" ? undefined : Number(sort_order),
        cover,
        endTime: endTime ? new Date(endTime).toISOString() : undefined,
        discount: discount === "" ? undefined : Number(discount),
        products,
      } as any; // Cast as any if your service expects a different type
      if (venteFlash && venteFlash._id) {
        await updateVenteFlash(venteFlash._id, payload);
      } else {
        await createVenteFlash(payload);
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
        <h2>{venteFlash ? "Edit Vente Flash" : "Add Vente Flash"}</h2>
        <label>
          Title
          <input
            value={designation_fr}
            onChange={(e) => setDesignationFr(e.target.value)}
            required
            placeholder="Vente Flash Title"
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
          Published
          <select value={publier} onChange={(e) => setPublier(e.target.value)}>
            <option value="1">Yes</option>
            <option value="0">No</option>
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
          Sort Order
          <input
            type="number"
            value={sort_order}
            onChange={(e) => setSortOrder(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Sort Order"
          />
        </label>
        <label>
          Cover (image path)
          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            placeholder="Cover image path"
          />
        </label>
        <label>
          End Time
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="End Time"
          />
        </label>
        <label>
          Discount (%)
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Discount"
            min={0}
            max={100}
          />
        </label>
        <label>
          Products in Vente Flash
          <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #eee", padding: 8 }}>
            {allProducts.map((prod) => (
              <div key={prod._id}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={products.includes(prod._id)}
                    onChange={() => handleProductToggle(prod._id)}
                  />
                  {prod.designation_fr || prod.name || prod.slug || prod._id}
                </label>
              </div>
            ))}
          </div>
        </label>
        <div className="dashboard-modal-actions">
          <button type="submit" disabled={loading}>
            {venteFlash ? "Update" : "Create"}
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}