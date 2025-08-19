// c:\Users\LENOVO\Desktop\ecommerce\template_front\src\app\(site)\(pages)\produits\[slug]\metadata.ts

import axios from "axios";

// Helper to strip HTML tags for meta description
function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  try {
    const res = await axios.get(`${API_URL}/products/slug/${params.slug}`);
    const product = res.data?.product;
    if (!product) return {};

    const title = product.designation_fr || product.designation || "Produit";
    const description = stripHtml(
      product.meta_description_fr ||
      product.description_cover ||
      product.content_seo ||
      product.description ||
      ""
    );

    const ogImage = product.cover
      ? `${API_URL.replace(/\\/g, "/").replace(/\/$/, "")}/${product.cover.replace(/^\/+/, "")}`
      : "/placeholder.svg"; // fallback image

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [ogImage],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata for product', params.slug, error);
    return {};
  }
}
