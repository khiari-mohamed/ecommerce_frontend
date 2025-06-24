import React from "react";
import { Blog } from "../../../../../types/blog";
import "../../styles/dashboard.css";
interface Props {
  open: boolean;
  onClose: () => void;
  blog: Blog | null;
}

export default function BlogViewModal({ open, onClose, blog }: Props) {
  if (!open || !blog) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content">
        <h2>Blog Details</h2>
        <ul>
          <li><strong>Title:</strong> {blog.title || blog.designation_fr}</li>
          <li><strong>Slug:</strong> {blog.slug}</li>
          <li><strong>Published:</strong> {blog.publier === "1" ? "Yes" : "No"}</li>
          <li>
            <strong>Description:</strong>
            <div
              style={{ marginTop: 4 }}
              dangerouslySetInnerHTML={{ __html: blog.description || "" }}
            />
          </li>
          <li>
            <strong>Meta:</strong>
            <div
              style={{ marginTop: 4 }}
              dangerouslySetInnerHTML={{ __html: blog.meta || "" }}
            />
          </li>
          <li><strong>Created At:</strong> {blog.createdAt || blog.created_at}</li>
          <li><strong>Updated At:</strong> {blog.updatedAt || blog.updated_at}</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}