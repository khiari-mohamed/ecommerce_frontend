import React from "react";
import BlogGrid from "@/components/BlogGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Musculation & Nutrition Sportive Tunisie – Conseils & Guides | Protein.tn",
  description: "Lisez nos articles experts sur la musculation, la nutrition sportive, la prise de masse, la sèche et la santé. Astuces pratiques et informations fiables pour progresser.",
  keywords: ["blog musculation Tunisie", "conseils nutrition sportive", "guide prise de masse", "programme sèche", "santé fitness Tunisie", "récupération sportive"],
  openGraph: {
    title: "Blog Musculation & Nutrition Sportive Tunisie – Conseils & Guides | Protein.tn",
    description: "Lisez nos articles experts sur la musculation, la nutrition sportive, la prise de masse, la sèche et la santé. Astuces pratiques et informations fiables pour progresser.",
    url: "https://www.protein.tn/blogs/blog-grid",
    siteName: "Sobitas - Protein.tn",
    images: [
      {
        url: "https://www.protein.tn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Blog Protein.tn",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Nutrition Sportive & Musculation | Protein.tn",
    description: "Découvrez tous nos articles, conseils et actualités sur la nutrition sportive.",
    images: ["https://www.protein.tn/og-image.jpg"],
  },
  robots: "index, follow",
  alternates: {
    canonical: "/blogs/blog-grid",
  },
};

const BlogGridPage = () => {
  return (
    <main>
      <BlogGrid />
    </main>
  );
};

export default BlogGridPage;