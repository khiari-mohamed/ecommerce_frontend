import React from "react";
import { Category } from "@/types/category";
import "../../styles/dashboard.css";
interface Props {
  category: Category;
  onClose: () => void;
}

const CategoryViewModal: React.FC<Props> = ({ category, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Category Details</h2>
      <div className="flex gap-4 items-center mb-4">
        <img
          src={category.image?.url || "/images/placeholder.png"}
          alt={category.designation || category.title || "Category"}
          className="w-20 h-20 object-cover rounded-lg border"
        />
        <div>
          <div className="font-bold">{category.designation || category.title}</div>
          <div className="text-gray-500 text-sm">{category.slug}</div>
        </div>
      </div>
      <button className="btn btn-secondary" onClick={onClose}>Close</button>
    </div>
  </div>
);

export default CategoryViewModal;