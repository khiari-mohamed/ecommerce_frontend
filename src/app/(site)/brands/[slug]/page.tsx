import { notFound } from "next/navigation";
import { Metadata } from "next";
import axios from "@/lib/axios";
import BrandProductGrid from "./BrandProductsGrid";
import Link from "next/link";
import Image from "next/image";
import React from "react";

interface Brand {
  _id: string;
  id: string;
  slug: string;
  designation_fr: string;
  logo: string;
  description_fr?: string;
}
interface BrandPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: {
  params?: { slug: string };
}): Promise<Metadata> {
  const slug = params?.slug;

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/brands?slug=${encodeURIComponent(slug)}`
    );
    const brand: Brand | undefined = res.data?.[0];
    if (!brand) return {};
    return {
      title: brand.designation_fr,
      description: brand.description_fr,
      openGraph: {
        images: brand.logo ? [`/images/brand/${brand.logo}`] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function BrandPage({
  params,
}: {
  params?: { slug: string };
}) {
  const slug = params?.slug;

  let brand: Brand | null = null;
  let products: any[] = [];
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/brands?slug=${encodeURIComponent(slug)}`
    );
    brand = res.data?.[0] || null;
    if (brand) {
      const prodRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/products?brand=${brand.id}`
      );
      products = Array.isArray(prodRes.data?.data?.products) ? prodRes.data.data.products : [];
    }
  } catch {
    brand = null;
    products = [];
  }

  if (!brand) {
    notFound();
  }

  // Minimal ClientHeaderOffset implementation
  function ClientHeaderOffset() {
    React.useEffect(() => {
      function setOffset() {
        // You can adjust this value to match your header height on mobile/desktop
        const mobile = window.innerWidth < 640;
        const offset = mobile ? 60 : 70;
        document.documentElement.style.setProperty('--header-offset', offset + 'px');
      }
      setOffset();
      window.addEventListener('resize', setOffset);
      return () => window.removeEventListener('resize', setOffset);
    }, []);
    return null;
  }

  return (
  <>
  {/* Adaptive header offset for mobile - handled in client component */}
  <ClientHeaderOffset />
  <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8" style={{ paddingTop: 'var(--header-offset, 70px)' }}>
  <div className="flex flex-col items-center">
  <Image
  src={`/images/brand/${brand.logo}`}
  alt={brand.designation_fr}
  width={128}
  height={128}
  className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4"
  />
  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center break-words">
  <Link href={`/brands/${encodeURIComponent(brand.slug)}`}>{brand.designation_fr}</Link>
  </h1>
  {brand.description_fr && (
  <div
  className="prose prose-blue max-w-none text-gray-700 text-center mb-4"
  dangerouslySetInnerHTML={{ __html: brand.description_fr }}
  />
  )}
  </div>
  <BrandProductGrid products={products} />
  </div>
  </>
  );
  }
