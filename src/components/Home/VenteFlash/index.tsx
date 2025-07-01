"use client";
import { useEffect, useState } from "react";
import ProductCard from "../../shared/productCard";
import { useAuth } from "../../../context/authContext";
import { motion, AnimatePresence } from "framer-motion";
import Countdown from "./Countdown";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const FALLBACK_IMAGE = "/static-flash/p8.png"; // Place this image in your public folder

function mapProductToCard(product: any): any {
  return {
    ...product,
    _id: product._id || product.id,
    designation: product.designation || product.designation_fr,
    mainImage: { url: product.mainImage?.url || product.cover || FALLBACK_IMAGE },
    inStock: true, // FORCE TRUE
    slug: product.slug,
    price: product.price,
    oldPrice: product.oldPrice,
    brand: product.brand,
    reviews: product.reviews || [],
  };
}

type FlashSale = {
  id: string;
  designation_fr: string;
  cover: string;
  description: string;
  slug: string;
  endTime?: string;
  discount?: number;
};

type Product = any; // Replace with your Product type if available

const staticFlashSales: FlashSale[] = [
  // ... your static flash sales as before ...
];

const staticProductsMap: { [id: string]: Product[] } = {
  // ... your static products as before ...
};

const VenteFlash = () => {
  const { user } = useAuth();
  const [flashSales, setFlashSales] = useState<FlashSale[]>(staticFlashSales);
  const [productsMap, setProductsMap] = useState<{ [id: string]: Product[] }>({ ...staticProductsMap });
  const [timers, setTimers] = useState<{ [id: string]: { hours: number; minutes: number; seconds: number } }>({});
  const [productsLoaded, setProductsLoaded] = useState<{ [id: string]: boolean }>({
    "static-1": true,
    "static-2": true,
    "static-3": true,
  });
  const [currentFlashIndex, setCurrentFlashIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Fetch all flash sales and their products (append after static)
  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const res = await axios.get(`${API_URL}/vente-flash`);
        const filtered = res.data.filter(
          (item: FlashSale) => !staticFlashSales.some((s) => s.id === item.id)
        );
        const limited = filtered.slice(0, 5);
        setFlashSales([...staticFlashSales, ...limited]);

        // Initialize countdowns for fetched sales
        const initialTimers: typeof timers = {};
        limited.forEach((item: FlashSale) => {
          if (item.endTime) {
            initialTimers[item.id] = calculateTimeRemaining(item.endTime);
          }
        });
        setTimers((prev) => ({ ...prev, ...initialTimers }));

        // Fetch products for each fetched flash sale
        const productsFetches = limited.map((item: FlashSale) =>
          axios
            .get(`${API_URL}/vente-flash/${item.id}/products`)
            .then(r => ({ id: item.id, products: r.data }))
            .catch(() => ({ id: item.id, products: [] }))
        );
        const productsResults = await Promise.all(productsFetches);
        const map: { [id: string]: Product[] } = {};
        const loaded: { [id: string]: boolean } = {};
        productsResults.forEach(({ id, products }) => {
          map[id] = Array.isArray(products) ? products : [];
          loaded[id] = true;
        });
        setProductsMap((prev) => ({ ...prev, ...map }));
        setProductsLoaded((prev) => ({ ...prev, ...loaded }));
      } catch (error) {
        console.error("Error fetching flash sales or products:", error);
      }
    };
    fetchFlashSales();
  }, []);

  // Reset product index when flash changes
  useEffect(() => {
    setCurrentProductIndex(0);
  }, [currentFlashIndex]);

  // Update all countdowns every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated: typeof prev = {};
        for (const id in prev) {
          updated[id] = updateTimer(prev[id]);
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateTimer = (prev: { hours: number; minutes: number; seconds: number }) => {
    if (!prev) return { hours: 0, minutes: 0, seconds: 0 };
    if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
    if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
    if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const calculateTimeRemaining = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return {
      hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((diff / 1000 / 60) % 60)),
      seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
    };
  };

  // Carousel controls
  const goToPrevFlash = () => {
    setCurrentFlashIndex((prev) => (prev === 0 ? flashSales.length - 1 : prev - 1));
  };
  const goToNextFlash = () => {
    setCurrentFlashIndex((prev) => (prev === flashSales.length - 1 ? 0 : prev + 1));
  };

  // Product carousel controls
  const currentFlash = flashSales[currentFlashIndex];
  const currentProducts = productsMap[currentFlash?.id] || [];
  const mainProduct = currentProducts.length > 0 ? currentProducts[currentProductIndex] : null;

  const goToPrevProduct = () => {
    setCurrentProductIndex((prev) =>
      prev === 0 ? currentProducts.length - 1 : prev - 1
    );
  };
  const goToNextProduct = () => {
    setCurrentProductIndex((prev) =>
      prev === currentProducts.length - 1 ? 0 : prev + 1
    );
  };

  // SVG Arrow
  const ArrowLeft = (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const ArrowRight = (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <section className="w-full py-12 bg-gradient-to-br from-red-50 via-yellow-50 to-orange-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, x: 40 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
          }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white uppercase mb-2 tracking-wide">
            Ventes Flash en Cours
          </h2>
        </motion.div>

        {flashSales.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Aucun article en vente flash pour le moment
            </p>
          </div>
        ) : (
          <div className="relative flex items-center justify-center min-h-[520px]">
            {/* Main flash carousel arrows */}
            <button
              aria-label="Flash précédent"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full shadow p-2 transition disabled:opacity-30"
              style={{
                background: "#FF4500",
                border: "2px solid #FF4500",
                color: "#fff"
              }}
              onClick={goToPrevFlash}
              disabled={flashSales.length <= 1}
              type="button"
            >
              {ArrowLeft}
            </button>
            <div className="w-full flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFlash.id}
                  className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-primary/20 hover:shadow-2xl transition-all relative max-w-2xl mx-auto"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0, x: 40 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
                    exit: { opacity: 0, x: -40, transition: { duration: 0.4, ease: "easeIn" } },
                  }}
                >
                  {/* IMAGE */}
                  <div className="relative flex-shrink-0 w-full md:w-2/5 flex items-center justify-center bg-gray-50 dark:bg-gray-800 p-4">
                    {mainProduct && (mainProduct.mainImage?.url || mainProduct.cover) ? (
                      <img
                        src={mainProduct.mainImage?.url || mainProduct.cover}
                        alt={mainProduct.designation || mainProduct.designation_fr || ""}
                        className="w-full h-60 md:h-72 object-contain rounded-lg shadow-md bg-white"
                        style={{ background: "#fff" }}
                      />
                    ) : (
                      <div className="w-full h-60 md:h-72 flex items-center justify-center rounded-lg shadow-md bg-white text-gray-300 text-lg">
                        {/* No image available */}
                      </div>
                    )}
                    {/* VENTE FLASH badge always visible, styled */}
                    <div className="absolute top-2 left-2 z-20">
                      <span
                        className="inline-block text-white text-xs font-bold px-3 py-1 rounded shadow uppercase tracking-wider"
                        style={{ background: "#FF4500" }}
                      >
                        Vente Flash
                      </span>
                    </div>
                    {typeof currentFlash.discount === "number" &&
                      currentFlash.discount > 0 && (
                        <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                          -{currentFlash.discount}%
                        </span>
                      )}
                  </div>
                  {/* CONTENT */}
                  <div className="flex-1 flex flex-col justify-center p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center md:text-left leading-tight group-hover:text-primary transition-colors">
                      {currentFlash.designation_fr}
                    </h3>
                    {currentFlash.endTime &&
                      timers[currentFlash.id] && (
                        <Countdown timeRemaining={timers[currentFlash.id]} />
                      )}
                    <div
                      className="prose dark:prose-invert text-base text-gray-600 dark:text-gray-300 mt-2 mb-4 line-clamp-4 text-center md:text-left"
                      dangerouslySetInnerHTML={{
                        __html: currentFlash.description,
                      }}
                    />
                    {/* Product carousel */}
                    {productsLoaded[currentFlash.id] ? (
                      currentProducts.length > 0 ? (
                        <div className="relative mt-4 flex items-center justify-center">
                          <button
                            aria-label="Produit précédent"
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow p-2 transition disabled:opacity-30"
                            style={{
                              background: "#FF4500",
                              border: "2px solid #FF4500",
                              color: "#fff"
                            }}
                            onClick={goToPrevProduct}
                            disabled={currentProducts.length <= 1}
                            type="button"
                          >
                            {ArrowLeft}
                          </button>
                          <div className="flex gap-3 w-full justify-center">
                            <div
  key={`vente-flash-${currentFlash.id}-${mainProduct?.id || mainProduct?._id}`}
  className="min-w-[260px] max-w-[320px] flex-shrink-0"
  style={{ scrollSnapAlign: "start" }}
>
  {mainProduct && (
    <>
      <ProductCard
        user={user}
        product={mapProductToCard(mainProduct)}
        showDiscountBadge={true}
        isFlashSale={true}
      />
      {mainProduct.slug && (
        <a
          href={`/produits/${mainProduct.slug}`}
          className="mt-4 inline-block font-bold py-2 px-6 rounded transition text-lg w-full text-center"
          style={{
            background: "#FF4500",
            color: "#fff",
            border: "2px solid #FF4500",
            marginTop: "-50px"
          }}
        >
          Voir loffre
        </a>
      )}
    </>
  )}
</div>
                          </div>
                          <button
                            aria-label="Produit suivant"
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow p-2 transition disabled:opacity-30"
                            style={{
                              background: "#FF4500",
                              border: "2px solid #FF4500",
                              color: "#fff"
                            }}
                            onClick={goToNextProduct}
                            disabled={currentProducts.length <= 1}
                            type="button"
                          >
                            {ArrowRight}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-xs text-gray-400 mt-4">
                          Aucun produit pour cette vente flash.
                        </div>
                      )
                    ) : (
                      <div className="text-center text-xs text-gray-400 mt-4">
                        Chargement des produits...
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <button
              aria-label="Flash suivant"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full shadow p-2 transition disabled:opacity-30"
              style={{
                background: "#FF4500",
                border: "2px solid #FF4500",
                color: "#fff"
              }}
              onClick={goToNextFlash}
              disabled={flashSales.length <= 1}
              type="button"
            >
              {ArrowRight}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VenteFlash;