import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobitas | Home",
  description: "Sobitas e-commerce store - Discover the best products, deals, and more.",
  openGraph: {
    title: "Sobitas | Home",
    description: "Sobitas e-commerce store - Discover the best products, deals, and more.",
    url: "https://yourdomain.com/",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas e-commerce store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobitas | Home",
    description: "Sobitas e-commerce store - Discover the best products, deals, and more.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/", // Uncomment if you want to set canonical
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
