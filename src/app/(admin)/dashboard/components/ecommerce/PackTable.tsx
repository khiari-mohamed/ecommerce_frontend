import React, { useEffect, useState } from "react";
import { fetchAllPacks } from "../../../../../services/pack";
import { Pack } from "../../../../../types/pack";
import "../../styles/dashboard.css";

const fallbackImages = [
  "/images/packs/pack.webp",
  "/images/packs/pack2.webp",
  "/images/packs/pack3.webp",
  "/images/packs/pack4.webp",
];

interface Props {
  onEdit: (pack: Pack) => void;
  onView: (pack: Pack) => void;
  onDelete: (pack: Pack) => void;
}

export default function PackTable({ onEdit, onView, onDelete }: Props) {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAllPacks()
      .then(setPacks)
      .finally(() => setLoading(false));
  }, []);

  // Helper to get the correct image for each pack
  const getPackImage = (pack: Pack, index: number) => {
    if (pack.mainImage?.url) return pack.mainImage.url;
    return fallbackImages[index % fallbackImages.length];
  };

  return (
    <div className="dashboard-table-wrapper">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Price</th>
              <th>Promo</th>
              <th>Quantity</th>
              <th>Published</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packs.map((pack, idx) => (
              <tr key={pack._id}>
                <td>
                  <img
                    src={getPackImage(pack, idx)}
                    alt={pack.designation_fr || pack.slug || "Pack"}
                    className="category-table-image"
                  />
                </td>
                <td>{pack.designation_fr}</td>
                <td>{pack.slug}</td>
                <td>{pack.prix}</td>
                <td>{pack.promo}</td>
                <td>{pack.qte}</td>
                <td>{pack.publier === "1" ? "Yes" : "No"}</td>
                <td>{pack.created_at ? new Date(pack.created_at).toLocaleDateString() : ""}</td>
                <td>
                  <button onClick={() => onView(pack)}>View</button>
                  <button onClick={() => onEdit(pack)}>Edit</button>
                  <button onClick={() => onDelete(pack)}>Delete</button>
                </td>
              </tr>
            ))}
            {packs.length === 0 && (
              <tr>
                <td colSpan={9} className="category-table-empty">
                  No packs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}