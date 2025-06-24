
import React from "react";
import { MusculationProduct } from "../../../../../types/MusculationProducts";
import "../../styles/dashboard.css";
interface Props {
  open: boolean;
  onClose: () => void;
  product: MusculationProduct | null;
}

export default function MusculationProductViewModal({ open, onClose, product }: Props) {
  if (!open || !product) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content">
        <h2>Product Details</h2>
        <ul>
          <li><strong>Name:</strong> {product.designation_fr}</li>
          <li><strong>Slug:</strong> {product.slug}</li>
          <li><strong>Price:</strong> {product.prix}</li>
          <li><strong>Promo:</strong> {product.promo}</li>
          <li><strong>Quantity:</strong> {product.qte}</li>
          <li><strong>Published:</strong> {product.publier === "1" ? "Yes" : "No"}</li>
          <li><strong>Subcategory:</strong> {product.sous_categorie_id}</li>
          <li>
            <strong>Description:</strong>
            <div
              style={{ marginTop: 4, background: "#f9fafb", padding: "0.5rem", borderRadius: "4px" }}
              dangerouslySetInnerHTML={{
                __html: product.description_fr && product.description_fr.trim() !== ""
                  ? product.description_fr
                  : "<em>No description provided.</em>"
              }}
            />
          </li>
          <li>
            <strong>Meta:</strong>
            <div
              style={{ marginTop: 4, background: "#f9fafb", padding: "0.5rem", borderRadius: "4px" }}
              dangerouslySetInnerHTML={{
                __html: product.meta && product.meta.trim() !== ""
                  ? product.meta
                  : "<em>No meta information.</em>"
              }}
            />
          </li>
          <li><strong>Created At:</strong> {product.created_at}</li>
          <li><strong>Updated At:</strong> {product.updated_at}</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
