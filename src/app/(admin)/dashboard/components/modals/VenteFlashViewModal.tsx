import React from "react";
import { VenteFlash } from "../../../../../types/venteFlash";
import "../../styles/dashboard.css";
interface Props {
  open: boolean;
  onClose: () => void;
  venteFlash: VenteFlash | null;
}

export default function VenteFlashViewModal({ open, onClose, venteFlash }: Props) {
  if (!open || !venteFlash) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content">
        <h2>Vente Flash Details</h2>
        <ul>
          <li><strong>Title:</strong> {venteFlash.designation_fr}</li>
          <li><strong>Slug:</strong> {venteFlash.slug}</li>
          <li><strong>Published:</strong> {venteFlash.publier === "1" ? "Yes" : "No"}</li>
          <li>
            <strong>Description:</strong>
            <div
              style={{ marginTop: 4 }}
              dangerouslySetInnerHTML={{ __html: venteFlash.description || "" }}
            />
          </li>
          <li><strong>Sort Order:</strong> {venteFlash.sort_order ?? ""}</li>
          <li><strong>Created At:</strong> {venteFlash.created_at}</li>
          <li><strong>Updated At:</strong> {venteFlash.updated_at}</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}