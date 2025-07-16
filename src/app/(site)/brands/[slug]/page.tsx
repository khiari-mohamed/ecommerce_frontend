import { notFound } from "next/navigation";
import { Metadata } from "next";
import axios from "@/lib/axios";
import BrandProductGrid from "./BrandProductsGrid";
import BrandClient from "./BrandClient";
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
  params: Promise<any>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

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
  params: Promise<any>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let brand: Brand | null = null;
  let products: any[] = [];
  let categories: any[] = [];
  let brands: any[] = [];
  let aromas: any[] = [];
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
      // Fetch categories
      const catRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/categories`
      );
      categories = Array.isArray(catRes.data) ? catRes.data : [];
      // Fetch brands
      const brandsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/brands`
      );
      brands = Array.isArray(brandsRes.data) ? brandsRes.data : [];
      // Fetch aromas
      const aromasRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/aromas`
      );
      aromas = Array.isArray(aromasRes.data) ? aromasRes.data : [];
    }
  } catch {
    brand = null;
    products = [];
    categories = [];
    brands = [];
    aromas = [];
  }

  if (!brand) {
    notFound();
  }

  return <BrandClient brand={brand} products={products} categories={categories} brands={brands} aromas={aromas} />;
}
