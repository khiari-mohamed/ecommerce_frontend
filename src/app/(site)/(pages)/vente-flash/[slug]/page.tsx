"use client";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VenteFlashSlugPage({ params }: { params: Promise<any> }) {
  const [slug, setSlug] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    async function resolveParams() {
      const resolvedParams = await params;
      if (isMounted) setSlug(resolvedParams.slug);
    }
    resolveParams();
    return () => { isMounted = false; };
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    async function fetchData() {
      try {
        // Fetch all flash sale products and find the one with the matching slug
        const res = await axios.get(`${API_URL}/vente-flash`);
        const found = Array.isArray(res.data)
          ? res.data.find((item) => item.slug === slug)
          : null;
        if (!found) return notFound();
        // Redirect to the product details page with the found product's id
        router.replace(`/product-details?id=${found.id}`);
      } catch (err) {
        notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-lg text-gray-400">Chargement...</span>
      </div>
    );
  }

  // No need to render anything else, as we redirect
  return null;
}
