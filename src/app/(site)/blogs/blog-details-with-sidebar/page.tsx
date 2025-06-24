import React from "react";
import BlogDetailsWithSidebar from "@/components/BlogDetailsWithSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créatine : tout ce que vous devez savoir | Sobitas Blog",
  description: "Découvrez les bienfaits, le dosage et l'impact de la créatine sur la performance sportive avec Sobitas.",
  openGraph: {
    title: "Créatine : tout ce que vous devez savoir | Sobitas Blog",
    description: "Découvrez les bienfaits, le dosage et l'impact de la créatine sur la performance sportive avec Sobitas.",
    url: "https://yourdomain.com/blogs/blog-details-with-sidebar/creatine-tout-ce-que-vous-devez-savoir-sur-ses-bienfaits-dosage-et-performance-sportive-protein-tn",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Créatine",
      },
    ],
    locale: "fr_FR",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Créatine : tout ce que vous devez savoir | Sobitas Blog",
    description: "Découvrez les bienfaits, le dosage et l'impact de la créatine sur la performance sportive avec Sobitas.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/blogs/blog-details-with-sidebar/creatine-tout-ce-que-vous-devez-savoir-sur-ses-bienfaits-dosage-et-performance-sportive-protein-tn", // Uncomment if you want to set canonical
};

const BlogDetailsWithSidebarPage = () => {
  return (
    <main>
      <BlogDetailsWithSidebar slug="creatine-tout-ce-que-vous-devez-savoir-sur-ses-bienfaits-dosage-et-performance-sportive-protein-tn"/>
    </main>
  );
};

export default BlogDetailsWithSidebarPage;
