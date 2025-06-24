import React, { useEffect, useState } from "react";
import { getAllSubCategories } from "../../../../../services/subcategories";
import { SubCategory } from "../../../../../types/subcategory";

interface Props {
  onEdit: (subcategory: SubCategory) => void;
  onView: (subcategory: SubCategory) => void;
  onDelete: (subcategory: SubCategory) => void;
}

export default function SubcategoryTable({ onEdit, onView, onDelete }: Props) {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllSubCategories()
      .then(setSubcategories)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-table-wrapper">
      {loading ? (
        <div className="dashboard-table-loading">Loading...</div>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Slug</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((sub) => (
              <tr key={sub._id}>
                <td>
                  {sub.name ||
                    sub.designation ||
                    sub.designation_fr ||
                    sub.slug ||
                    sub.id ||
                    sub._id}
                </td>
                <td>
                  {typeof sub.category === "object" && sub.category
                    ? sub.category.name ||
                      sub.category.designation ||
                      sub.category.designation_fr ||
                      sub.category.slug ||
                      sub.category.id ||
                      sub.category._id ||
                      ""
                    : typeof sub.category === "string"
                    ? sub.category
                    : sub.categorie_id || ""}
                </td>
                <td>{sub.slug}</td>
                <td>
                  {sub.createdAt
                    ? new Date(sub.createdAt).toLocaleDateString()
                    : ""}
                </td>
                <td>
                  <button className="dashboard-table-action-btn view" onClick={() => onView(sub)}>View</button>
                  <button className="dashboard-table-action-btn edit" onClick={() => onEdit(sub)}>Edit</button>
                  <button className="dashboard-table-action-btn delete" onClick={() => onDelete(sub)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}