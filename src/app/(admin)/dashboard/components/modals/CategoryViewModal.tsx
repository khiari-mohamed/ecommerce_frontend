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
          src={category.cover ? `/images/categories/${category.cover.split('/').pop()}` : "/images/placeholder.png"}
          alt={category.alt_cover || category.designation || category.title || "Category"}
          className="w-20 h-20 object-cover rounded-lg border"
        />
        <div>
          <div className="font-bold">{category.designation || category.title}</div>
          <div className="text-gray-500 text-sm">{category.slug}</div>
        </div>
      </div>
      {/* Additional info */}
      <div className="mb-2">
        {category.designation_fr && (
          <div><span className="font-semibold">Nom FR:</span> {category.designation_fr}</div>
        )}
        {category.description_fr && (
          <div className="mb-1"><span className="font-semibold">Description FR:</span> <span dangerouslySetInnerHTML={{ __html: category.description_fr }} /></div>
        )}
        {category.alt_cover && (
          <div><span className="font-semibold">Alt Cover:</span> {category.alt_cover}</div>
        )}
        {category.description_cover && (
          <div><span className="font-semibold">Description Cover:</span> {category.description_cover}</div>
        )}
        {category.meta && (
          <div><span className="font-semibold">Meta:</span> {category.meta}</div>
        )}
        {category.more_details && (
          <div><span className="font-semibold">More Details:</span> <span dangerouslySetInnerHTML={{ __html: category.more_details }} /></div>
        )}
        {category.nutrition_values && (
          <div><span className="font-semibold">Nutrition Values:</span> <span dangerouslySetInnerHTML={{ __html: category.nutrition_values }} /></div>
        )}
        {category.questions && (
          <div><span className="font-semibold">Questions:</span> <span dangerouslySetInnerHTML={{ __html: category.questions }} /></div>
        )}
      </div>
      <button className="btn btn-secondary" onClick={onClose}>Close</button>
    </div>
  </div>
);

export default CategoryViewModal;