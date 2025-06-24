import BlogDetails from "@/components/BlogDetails";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Régime Keto : tout savoir sur le régime cétogène | Sobitas Blog",
  description: "Découvrez tout sur le régime cétogène (Keto) avec Sobitas : principes, bienfaits, conseils et plus.",
  openGraph: {
    title: "Régime Keto : tout savoir sur le régime cétogène | Sobitas Blog",
    description: "Découvrez tout sur le régime cétogène (Keto) avec Sobitas : principes, bienfaits, conseils et plus.",
    url: "https://yourdomain.com/blogs/blog-details/regime-keto-tout-savoir-sur-le-regime-cetogene-dit-keto-protein-tn",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Régime Keto",
      },
    ],
    locale: "fr_FR",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Régime Keto : tout savoir sur le régime cétogène | Sobitas Blog",
    description: "Découvrez tout sur le régime cétogène (Keto) avec Sobitas : principes, bienfaits, conseils et plus.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/blogs/blog-details/regime-keto-tout-savoir-sur-le-regime-cetogene-dit-keto-protein-tn", // Uncomment if you want to set canonical
};

const BlogDetailsPage = () => {
  return (
    <main>
      <BlogDetails slug="regime-keto-tout-savoir-sur-le-regime-cetogene-dit-keto-protein-tn" />
    </main>
  );
};

export default BlogDetailsPage;
