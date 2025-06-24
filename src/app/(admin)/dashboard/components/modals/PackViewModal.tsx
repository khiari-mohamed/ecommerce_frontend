
import React from "react";
import { Pack } from "../../../../../types/pack";
import "../../styles/dashboard.css";

interface Props {
  open: boolean;
  onClose: () => void;
  pack: Pack | null;
}

export default function PackViewModal({ open, onClose, pack }: Props) {
  if (!open || !pack) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content">
        <h2>Pack Details</h2>
        <ul>
          <li><strong>Name:</strong> {pack.designation_fr}</li>
          <li><strong>Slug:</strong> {pack.slug}</li>
          <li><strong>Price:</strong> {pack.prix}</li>
          <li><strong>Promo:</strong> {pack.promo}</li>
          <li><strong>Quantity:</strong> {pack.qte}</li>
          <li><strong>Published:</strong> {pack.publier === "1" ? "Yes" : "No"}</li>
          <li><strong>Subcategory:</strong> {pack.sous_categorie_id}</li>
          <li>
            <strong>Description:</strong>
            <div
              style={{ marginTop: 4 }}
              dangerouslySetInnerHTML={{ __html: pack.description_fr || "" }}
            />
          </li>
          <li>
            <strong>Meta:</strong>
            <div
              style={{ marginTop: 4 }}
              dangerouslySetInnerHTML={{ __html: pack.meta || "" }}
            />
          </li>
          <li><strong>Created At:</strong> {pack.created_at}</li>
          <li><strong>Updated At:</strong> {pack.updated_at}</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
