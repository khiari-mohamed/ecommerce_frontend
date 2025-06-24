import React, { useEffect, useState } from "react";
import { getBlogs } from "../../../../../services/blog.service";
import { Blog } from "../../../../../types/blog";
import "../../styles/dashboard.css";

interface Props {
  onEdit: (blog: Blog) => void;
  onView: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
}

const BLOG_IMAGE_BASE = "/uploads/";

export default function BlogTable({ onEdit, onView, onDelete }: Props) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlogs()
      .then(setBlogs)
      .finally(() => setLoading(false));
  }, []);

  // Helper to get image URL
  const getImageUrl = (cover: any) => {
    if (!cover) return "/images/blog/blog-01.jpg";
    if (typeof cover === "string") {
      return cover.startsWith("http")
        ? cover
        : BLOG_IMAGE_BASE + cover.replace(/^\/+/, "");
    }
    if (cover.url) {
      return cover.url.startsWith("http")
        ? cover.url
        : BLOG_IMAGE_BASE + cover.url.replace(/^\/+/, "");
    }
    return "/images/blog/blog-01.jpg";
  };

  return (
    <div className="dashboard-table-wrapper">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Titre</th>
              <th>Slug</th>
              <th>Publié</th>
              <th>Créé</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td>
                  <img
                    src={getImageUrl(blog.cover)}
                    alt={blog.title || blog.designation_fr || "blog"}
                    style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                  />
                </td>
                <td>{blog.title || blog.designation_fr}</td>
                <td>{blog.slug}</td>
                <td>{blog.publier === "1" ? "Oui" : "Non"}</td>
                <td>
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString("fr-FR")
                    : blog.created_at
                    ? new Date(blog.created_at).toLocaleDateString("fr-FR")
                    : ""}
                </td>
                <td>
                  <button onClick={() => onView(blog)}>Voir</button>
                  <button onClick={() => onEdit(blog)}>Éditer</button>
                  <button onClick={() => onDelete(blog)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}