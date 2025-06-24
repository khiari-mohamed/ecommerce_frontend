import React from "react";
import BlogGrid from "@/components/BlogGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Sobitas",
  description: "Découvrez tous les articles, conseils et actualités sur le blog Sobitas.",
  openGraph: {
    title: "Blog | Sobitas",
    description: "Découvrez tous les articles, conseils et actualités sur le blog Sobitas.",
    url: "https://yourdomain.com/blogs/blog-grid",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Blog",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Sobitas",
    description: "Découvrez tous les articles, conseils et actualités sur le blog Sobitas.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/blogs/blog-grid", // Uncomment if you want to set canonical
};

const BlogGridPage = () => {
  return (
    <main>
      <BlogGrid />
    </main>
  );
};

export default BlogGridPage;
