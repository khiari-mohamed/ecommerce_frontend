import React from "react";
import BlogGridWithSidebar from "@/components/BlogGridWithSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog avec catégories | Sobitas",
  description: "Parcourez tous les articles du blog Sobitas avec filtres et catégories.",
  openGraph: {
    title: "Blog avec catégories | Sobitas",
    description: "Parcourez tous les articles du blog Sobitas avec filtres et catégories.",
    url: "https://yourdomain.com/blogs/blog-grid-with-sidebar",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Blog avec catégories",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog avec catégories | Sobitas",
    description: "Parcourez tous les articles du blog Sobitas avec filtres et catégories.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/blogs/blog-grid-with-sidebar", // Uncomment if you want to set canonical
};

const BlogGridWithSidebarPage = () => {
  return (
    <>
      <BlogGridWithSidebar />
    </>
  );
};

export default BlogGridWithSidebarPage;
