import React, { useEffect, useState } from "react";
import { getVenteFlashList } from "../../../../../services/venteFlash";
import { VenteFlash } from "../../../../../types/venteFlash";
import "../../styles/dashboard.css";
interface Props {
  onEdit: (item: VenteFlash) => void;
  onView: (item: VenteFlash) => void;
  onDelete: (item: VenteFlash) => void;
}

export default function VenteFlashTable({ onEdit, onView, onDelete }: Props) {
  const [items, setItems] = useState<VenteFlash[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getVenteFlashList()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-table-wrapper">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Published</th>
              <th>Sort Order</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.designation_fr}</td>
                <td>{item.slug}</td>
                <td>{item.publier === "1" ? "Yes" : "No"}</td>
                <td>{item.sort_order ?? ""}</td>
                <td>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : ""}
                </td>
                <td>
                  <button onClick={() => onView(item)}>View</button>
                  <button onClick={() => onEdit(item)}>Edit</button>
                  <button onClick={() => onDelete(item)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}