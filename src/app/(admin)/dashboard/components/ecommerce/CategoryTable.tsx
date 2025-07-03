import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Category } from "@/types/category";
import { getCategories } from "@/services/categories";
import categoryData from "../../../../../components/Home/Categories/categoryData"; // Adjust the path if needed
import "../../styles/dashboard.css";

interface Props {
  onEdit: (category: Category | null) => void;
  onDelete: (category: Category) => void;
  onView: (category: Category) => void;
}

const CategoryTable: React.FC<Props> = ({ onEdit, onDelete, onView }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  // Helper to get the correct image from categoryData
  const getCategoryImage = (cat: Category) => {
    // Try to match by id or title
    const match = categoryData.find(
      (c) =>
        c.id === cat.id ||
        c.title.toLowerCase() === (cat.designation || cat.title || "").toLowerCase()
    );
    return match?.img || "/images/placeholder.png";
  };

  return (
    <div className="category-table-root">
      <div className="category-table-header">
        <h2 className="category-table-title">Category List</h2>
        <button
          className="category-table-add-btn"
          onClick={() => onEdit(null)}
        >
          + Add Category
        </button>
      </div>
      {loading ? (
        <div className="category-table-loading">Loading...</div>
      ) : (
        <div className="category-table-tablewrap">
          <table className="category-table-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    <Image
                      src={getCategoryImage(cat)}
                      alt={cat.designation || cat.title || "Category"}
                      width={80}
                      height={80}
                      className="category-table-image"
                      loading="lazy"
                    />
                  </td>
                  <td className="category-table-name">{cat.designation || cat.title}</td>
                  <td className="category-table-slug">{cat.slug}</td>
                  <td>
                    <div className="category-table-actions">
                      <button className="category-table-action-edit" onClick={() => onEdit(cat)}>Edit</button>
                      <button className="category-table-action-delete" onClick={() => onDelete(cat)}>Delete</button>
                      <button className="category-table-action-view" onClick={() => onView(cat)}>View</button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="category-table-empty">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;