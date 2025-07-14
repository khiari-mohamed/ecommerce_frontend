"use client";
import Image from "next/image";
import Rate from "antd/es/rate";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formattedPrice";

// Utility to generate a consistent fake rating and review count per product
function getFakeReviewData(id: string | number) {
  // Simple hash for demo purposes
  const hash = typeof id === "string"
    ? id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    : Number(id);
  const reviewsCount = 8 + (hash % 113); // 8 to 120
  const stars = 3 + (hash % 3); // 3 to 5 stars
  return { reviewsCount, stars };
}

export default function SubcategoryProductCard({ product }: { product: any }) {
  const dispatch = useDispatch();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Best name
  const name = product.designation_fr || product.designation || product.name || "Produit";
  // Best price
  const price = Number(
    product.price ??
    product.prix ??
    product.discountedPrice ??
    product.promo ??
    0
  );
  const oldPrice = Number(
    product.oldPrice ??
    product.prix_ht ??
    product.price ??
    product.prix ??
    0
  );
  // Best image
  const imageSrcRaw =
    typeof product.cover === "string" && product.cover
      ? product.cover
      : product.mainImage?.url
      ? product.mainImage.url
      : Array.isArray(product.images) && product.images.length > 0
      ? product.images[0].url
      : "/placeholder.svg";
  const imageSrc =
    imageSrcRaw.startsWith("/") || imageSrcRaw.startsWith("http")
      ? imageSrcRaw
      : "/" + imageSrcRaw;

  // Consistent fake reviews per product
  const { reviewsCount, stars } = getFakeReviewData(product._id || product.id || name);

  // Discount
  const discountPercentage =
    oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const handleAddToCart = useCallback(() => {
    if (isAddingToCart || !product?.inStock) return;
    setIsAddingToCart(true);
    dispatch(
      addItemToCart({
        id: Number(product.id || product._id),
        title: name,
        price,
        discountedPrice: price,
        quantity: 1,
        imgs: product.images && Array.isArray(product.images) && product.images.length > 0
          ? { thumbnails: product.images.map((img: any) => img.url), previews: product.images.map((img: any) => img.url) }
          : product.mainImage?.url
          ? { thumbnails: [product.mainImage.url], previews: [product.mainImage.url] }
          : undefined,
        type: "Product",
        image: imageSrc,
        cover: product.cover,
        mainImage: product.mainImage,
        images: product.images,
        designation_fr: product.designation_fr,
        designation: product.designation,
      })
    );
    toast({
      title: "Ajouté au panier",
      description: `${name} a été ajouté à votre panier`,
      variant: "default",
    });
    setTimeout(() => setIsAddingToCart(false), 800);
  }, [dispatch, product, name, price, imageSrc, isAddingToCart]);

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-white rounded-md overflow-hidden border transition-all duration-300",
        isHovered ? "border-primary/40 shadow-lg -translate-y-1" : "border-gray-200",
        "hover:border-primary/20 hover:shadow-lg group",
        "w-full min-w-0" // Ensure card never overflows grid
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${name} card`}
    >
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between p-2">
        <div className="space-y-1 text-white">
          {discountPercentage > 0 && (
            <span className="py-0.5 px-1 text-xs sm:text-sm font-medium bg-[#ef837b] rounded-sm block">
              -{discountPercentage}%
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <Link
          href={`/products/${product?.slug}`}
          className="flex flex-col flex-1 h-full min-w-0"
          aria-label={`View details for ${name}`}
        >
          {/* Image at the top */}
          <div className="relative flex items-center justify-center p-2 sm:p-4 aspect-square bg-gray-50 min-w-0">
            {!product?.inStock && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                <div className="w-full px-4 py-1.5 text-sm font-medium text-center text-white shadow-md bg-[#FF4301] md:text-base transform rotate-[-5deg]">
                  Rupture de Stock
                </div>
              </div>
            )}
            <div
              className={cn(
                "transition-all duration-500 h-full w-full flex items-center justify-center",
                isImageLoaded ? "opacity-100" : "opacity-0",
                !product?.inStock && "opacity-40"
              )}
            >
              <Image
                className={cn(
                  "object-contain w-full h-auto max-h-[120px] sm:max-h-[150px] max-w-[90%] mx-auto transition-all duration-500",
                  isHovered ? "scale-110" : "scale-100"
                )}
                src={imageSrc}
                alt={name}
                width={300}
                height={300}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(true)}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
              />
            </div>
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 rounded-full sm:w-12 sm:h-12 border-primary/30 border-t-primary animate-spin"></div>
              </div>
            )}
          </div>

          {/* Stars and reviews under image */}
          <div className="flex flex-row flex-nowrap items-center justify-center mt-2 mb-2">
            <Rate
              value={stars}
              count={5}
              disabled
              allowHalf={false}
              style={{ color: "#FFD700", fontSize: 18 }}
              className="text-yellow-400"
            />
            <span className="ml-2 text-xs text-gray-500">
              ({reviewsCount})
            </span>
          </div>

          {/* Price under stars */}
          <div className="flex flex-row flex-nowrap items-center justify-center gap-2 mb-2">
            <span className="text-base font-semibold text-[#EF837B]">
              {formatCurrency(isNaN(price) ? 0 : price)}
            </span>
            {oldPrice > price && !isNaN(oldPrice) && (
              <span className="mt-1 text-sm text-gray-400 line-through">
                {formatCurrency(oldPrice)}
              </span>
            )}
          </div>

          {/* Title and brand under price */}
          {product?.brand && (
            <div className="mb-1.5">
              <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                {product.brand}
              </span>
            </div>
          )}
          <h3 className="mb-2 text-sm font-medium text-center w-full transition-colors sm:text-base line-clamp-2 group-hover:text-primary">
            {name}
          </h3>
        </Link>
        {/* Button always at the bottom, not overlapping */}
        <div className="mt-auto px-2 sm:px-3 pb-2 sm:pb-3 pt-2">
          <Button
            onClick={handleAddToCart}
            disabled={!product?.inStock || isAddingToCart}
            className={cn(
              "w-full gap-2 transition-all duration-300",
              !product?.inStock
                ? "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200"
                : "bg-primary hover:bg-primary/90"
            )}
            size="sm"
          >
            <ShoppingCart
              className={cn(
                "size-4",
                isHovered && product?.inStock && !isAddingToCart && "animate-bounce"
              )}
            />
            <span className="text-xs sm:text-sm">
              {isAddingToCart ? "Ajout en cours..." : product?.inStock ? "Ajouter au panier" : "Indisponible"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}