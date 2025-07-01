import { notFound } from "next/navigation";
import { Metadata } from "next";
import axios from "@/lib/axios";
import BrandProductGrid from "./BrandProductsGrid";
import Link from "next/link";
import Image from "next/image";

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
  params?: { slug: string } | Promise<{ slug: string }> ;
}): Promise<Metadata> {
  const resolvedParams = params && typeof (params as Promise<any>).then === "function"
    ? await params
    : params;
  const slug = resolvedParams?.slug;

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
  params?: { slug: string } | Promise<{ slug: string }> ;
}) {
  const resolvedParams = params && typeof (params as Promise<any>).then === "function"
    ? await params
    : params;
  const slug = resolvedParams?.slug;

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

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col items-center">
        <Image
          src={`/images/brand/${brand.logo}`}
          alt={brand.designation_fr}
          width={128}
          height={128}
          className="w-32 h-32 object-contain mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">
          <Link href={`/brands/${encodeURIComponent(brand.slug)}`}>
            {brand.designation_fr}
          </Link>
        </h1>
        {brand.description_fr && (
          <div
            className="prose prose-blue max-w-none text-gray-700 text-center mb-4"
            dangerouslySetInnerHTML={{ __html: brand.description_fr }}
          />
        )}
      </div>
      <BrandProductGrid products={products} />
    </main>
  );
}