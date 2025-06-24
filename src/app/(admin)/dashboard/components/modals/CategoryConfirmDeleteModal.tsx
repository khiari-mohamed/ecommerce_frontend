import React from "react";
import { Category } from "@/types/category";
import "../../styles/dashboard.css";
interface Props {
  category: Category | null;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<Props> = ({ category, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Delete Category</h2>
      <p>
        Are you sure you want to delete{" "}
        <span className="font-bold text-red-600">{category?.designation || category?.title}</span>?
      </p>
      <div className="flex justify-end gap-2 mt-6">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteModal;