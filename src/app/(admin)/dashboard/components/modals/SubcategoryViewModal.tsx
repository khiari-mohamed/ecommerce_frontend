import React, { useEffect, useRef } from "react";
import { SubCategory } from "../../../../../types/subcategory";
import "../../styles/dashboard.css";
interface Props {
  open: boolean;
  onClose: () => void;
  subcategory: SubCategory | null;
}

export default function SubcategoryViewModal({ open, onClose, subcategory }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Close on click outside modal
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open || !subcategory) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content dashboard-modal-view" ref={modalRef}>
        <button
          className="dashboard-modal-close-btn"
          aria-label="Close"
          onClick={onClose}
          type="button"
        >
          &times;
        </button>
        <h2 className="dashboard-modal-title">Subcategory Details</h2>
        <ul className="dashboard-modal-list">
          <li>
            <strong>Name:</strong> {subcategory.name || subcategory.designation}
          </li>
          <li>
            <strong>Category:</strong>{" "}
            {typeof subcategory.category === "string"
              ? subcategory.category
              : subcategory.category?.name || subcategory.category?.designation}
          </li>
          <li>
            <strong>Slug:</strong> {subcategory.slug}
          </li>
          <li>
            <strong>Description:</strong>
            <div
              className="dashboard-modal-html"
              dangerouslySetInnerHTML={{
                __html: subcategory.description_fr || "<em>No description</em>",
              }}
            />
          </li>
          <li>
            <strong>Meta:</strong>
            <div
              className="dashboard-modal-html"
              dangerouslySetInnerHTML={{
                __html: subcategory.meta || "<em>No meta</em>",
              }}
            />
          </li>
          <li>
            <strong>Created At:</strong> {subcategory.createdAt}
          </li>
          <li>
            <strong>Updated At:</strong> {subcategory.updatedAt}
          </li>
        </ul>
        <div className="dashboard-modal-actions">
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}