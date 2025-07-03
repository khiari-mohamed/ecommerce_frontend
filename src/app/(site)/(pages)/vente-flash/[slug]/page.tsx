"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import ProductCard from "@/components/shared/productCard";
import Countdown from "@/components/Home/VenteFlash/Countdown";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const FALLBACK_IMAGE = "/static-flash/p8.png";

export default function VenteFlashSlugPage({
  params,
}: {
  params?: { slug: string };
}) {
  const slug = params?.slug;

  const [flashSale, setFlashSale] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch flash sale by slug
        const res = await axios.get(`${API_URL}/vente-flash/slug/${slug}`);
        if (!res.data) return notFound();
        setFlashSale(res.data);

        // Fetch products for this flash sale
        const prodRes = await axios.get(`${API_URL}/vente-flash/${res.data.id}/products`);
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);

        // Setup timer if endTime exists
        if (res.data.endTime) {
          setTimer(calculateTimeRemaining(res.data.endTime));
        }
      } catch (err) {
        notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, [slug]);

  // Timer countdown effect
  useEffect(() => {
    if (!timer) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev ? updateTimer(prev) : null);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  function updateTimer(prev: { hours: number; minutes: number; seconds: number }) {
    if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
    if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
    if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  function calculateTimeRemaining(endTime: string) {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return {
      hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((diff / 1000 / 60) % 60)),
      seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
    };
  }

  function mapProductToCard(product: any): any {
    return {
      ...product,
      _id: product._id || product.id,
      designation: product.designation || product.designation_fr,
      mainImage: { url: product.mainImage?.url || product.cover || FALLBACK_IMAGE },
      inStock: product.inStock !== undefined ? product.inStock : true,
      slug: product.slug,
      price: product.price,
      oldPrice: product.oldPrice,
      brand: product.brand,
      reviews: product.reviews || [],
    };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-lg text-gray-400">Chargement...</span>
      </div>
    );
  }

  if (!flashSale) return notFound();

  return (
    <section
      className="w-full py-12"
      style={{ background: "linear-gradient(135deg, #FFF5F0 0%, #FFF0E0 100%)" }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-white rounded-xl shadow-lg p-6 md:p-10 border border-orange-200">
          {/* IMAGE & BADGE */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <Image
              src={
                flashSale.cover
                  ? flashSale.cover.startsWith("/")
                    ? flashSale.cover
                    : `${API_URL}/storage/${flashSale.cover}`
                  : FALLBACK_IMAGE
              }
              alt={flashSale.designation_fr}
              width={320}
              height={256}
              className="w-full max-w-xs h-40 md:h-64 object-contain rounded-lg shadow-md bg-white"
              onError={(e: any) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
            <span
              className="inline-block text-white text-xs font-bold px-3 py-1 rounded shadow uppercase tracking-wider mt-4"
              style={{ background: "#FF4500" }}
            >
              Vente Flash
            </span>
            {typeof flashSale.discount === "number" && flashSale.discount > 0 && (
              <span className="inline-block mt-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                -{flashSale.discount}%
              </span>
            )}
            {flashSale.endTime && timer && (
              <div className="mt-4">
                <Countdown timeRemaining={timer} />
              </div>
            )}
         </div>
          {/* DETAILS */}
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h1
              className="text-3xl md:text-4xl font-bold uppercase mb-2 tracking-wide text-center md:text-left"
              style={{ color: "#FF4500" }}
            >
              {flashSale.designation_fr}
            </h1>
            <div
              className="prose dark:prose-invert text-base text-gray-600 dark:text-gray-300 mt-2 mb-4 max-w-2xl"
              dangerouslySetInnerHTML={{
                __html: flashSale.description,
              }}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {flashSale.meta && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  {flashSale.meta}
                </span>
              )}
              {flashSale.brand && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  {flashSale.brand}
                </span>
              )}
            </div>
            <a
              href="/shop-with-sidebar"
              className="mt-6 inline-block font-bold py-2 px-6 rounded transition text-lg"
              style={{
                background: "#FF4500",
                color: "#fff",
                border: "2px solid #FF4500"
              }}
            >
              Voir tous les produits
            </a>
          </div>
        </div>
        {/* PRODUCTS */}

        <div className="mt-10">
          <h2
            className="text-2xl font-bold mb-6 uppercase tracking-wide"
            style={{ color: "#FF4500" }}
          >
            Offres de cette vente flash
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={mapProductToCard(product)}
                  showDiscountBadge={true}
                  isFlashSale={true}
                  typeRef="products"
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">
              Aucun produit pour cette vente flash.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


/*
export default function VenteFlashSlugPage() {
  return null;
}*/