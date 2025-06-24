import React, { useState } from "react";
import { deleteBlog } from "../../../../../services/blog.service";
import { Blog } from "../../../../../types/blog";
import "../../styles/dashboard.css";

interface Props {
  open: boolean;
  onClose: () => void;
  blog: Blog | null;
}

export default function BlogConfirmDeleteModal({ open, onClose, blog }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!blog?._id) return;
    setLoading(true);
    try {
      await deleteBlog(blog._id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open || !blog) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content">
        <h2>Delete Blog</h2>
        <p>Are you sure you want to delete <strong>{blog.title || blog.designation_fr}</strong>?</p>
        <div className="dashboard-modal-actions">
          <button onClick={handleDelete} disabled={loading}>
            Delete
          </button>
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}