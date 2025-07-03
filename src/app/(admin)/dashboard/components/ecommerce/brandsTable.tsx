import React from "react";
import Image from "next/image";
import { Brand } from "@/types/brand";
import "../../styles/dashboard.css";

interface BrandsTableProps {
  brands: Brand[];
  onView: (brand: Brand) => void;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

const BrandsTable: React.FC<BrandsTableProps> = ({ brands, onView, onEdit, onDelete }) => {
  return (
    <div className="dashboard-table-container">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nom (FR)</th>
            <th>Description</th>
            <th>Date de création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand._id}>
              <td>
                <Image
                  src={brand.logo}
                  alt={brand.designation_fr}
                  width={48}
                  height={48}
                  className="brand-logo"
                  style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 8 }}
                  loading="lazy"
                />
              </td>
              <td>{brand.designation_fr}</td>
              <td>
                <div
                  className="brand-description"
                  dangerouslySetInnerHTML={{
                    __html: brand.description_fr ? brand.description_fr.slice(0, 80) + "..." : "",
                  }}
                />
              </td>
              <td>{brand.created_at ? new Date(brand.created_at).toLocaleDateString() : "-"}</td>
              <td>
                <div className="table-actions">
                  <button className="btn-view" onClick={() => onView(brand)} title="Voir">
                    👁️
                  </button>
                  <button className="btn-edit" onClick={() => onEdit(brand)} title="Modifier">
                    ✏️
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(brand)} title="Supprimer">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {brands.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-table">
                Aucune marque trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BrandsTable;