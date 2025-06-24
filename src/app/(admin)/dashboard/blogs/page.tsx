"use client";
import React, { useState } from "react";
import BlogTable from "../components/ecommerce/BlogTable";
import BlogFormModal from "../components/modals/BlogFormModal";
import BlogViewModal from "../components/modals/BlogViewModal";
import BlogConfirmDeleteModal from "../components/modals/BlogConfirmDeleteModal";
import { Blog } from "../../../../types/blog";
import "../styles/dashboard.css";

export default function BlogsPage() {
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  return (
    <div className="dashboard-section">
      <div className="dashboard-section-header">
        <h1 className="dashboard-section-title">Blogs</h1>
        <button className="dashboard-btn" onClick={() => setOpenForm(true)}>
          + Add Blog
        </button>
      </div>
      <BlogTable
        onEdit={(blog) => {
          setSelectedBlog(blog);
          setOpenForm(true);
        }}
        onView={(blog) => {
          setSelectedBlog(blog);
          setOpenView(true);
        }}
        onDelete={(blog) => {
          setSelectedBlog(blog);
          setOpenDelete(true);
        }}
      />
      <BlogFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedBlog(null);
        }}
        blog={selectedBlog}
      />
      <BlogViewModal
        open={openView}
        onClose={() => {
          setOpenView(false);
          setSelectedBlog(null);
        }}
        blog={selectedBlog}
      />
      <BlogConfirmDeleteModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedBlog(null);
        }}
        blog={selectedBlog}
      />
    </div>
  );
}