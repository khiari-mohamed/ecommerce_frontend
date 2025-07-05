"use client";
import Image from "next/image";
import Rate from 'antd/es/rate';
import { ShoppingCart } from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { formatCurrency } from "../../lib/formattedPrice";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { toast } from "../../hooks/use-toast";
import { useIsMobile } from "../../hooks/use-mobile";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import { AppDispatch } from "@/redux/store";
import { getProductImageSrc } from "@/utils/image";

interface Product {
  _id: string;
  designation: string;
  mainImage: { url: string };
  price: number;
  oldPrice?: number;
  inStock?: boolean;
  slug: string;
  brand?: string;
  reviews?: Array<{ rating: number }>;
  features?: string[];
  venteflashDate?: string;
  isFlashSale?: boolean;
  discountPercentage?: number;
  [key: string]: any;
}

interface ProductCardProps {
  product: Product;
  type?: string;
  typeRef?: string;
  user?: any;
  showDiscountBadge?: boolean;
  isFlashSale?: boolean;
  fallbackImage?: string;
}

const ProductCard = memo(
  ({
    product,
    type = "products",
    typeRef = "products",
    user,
    showDiscountBadge = false,
    isFlashSale = false,
    fallbackImage,
  }: ProductCardProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // --- PATCH: Always ensure leading slash for image src ---
    function normalizeProduct(item: any) {
      return {
        ...item,
        imgs: item.imgs && item.imgs.thumbnails?.length > 0 && item.imgs.previews?.length > 0
          ? item.imgs
          : {
              thumbnails: (
                item.images && Array.isArray(item.images) && item.images.length > 0
                  ? item.images.map((img: any) => img.url)
                  : item.mainImage?.url
                  ? [item.mainImage.url]
                  : []
              ),
              previews: (
                item.images && Array.isArray(item.images) && item.images.length > 0
                  ? item.images.map((img: any) => img.url)
                  : item.mainImage?.url
                  ? [item.mainImage.url]
                  : []
              ),
            },
        mainImage: item.mainImage || { url: item.cover || "" },
        cover: item.cover || item.mainImage?.url || "",
      };
    }
    const normalizedProduct = normalizeProduct(product);
    const getSafeImageSrc = (src: string | undefined) => {
      if (!src) return "/placeholder.svg";
      if (src.startsWith("/") || src.startsWith("http")) return src;
      return "/" + src;
    };
    console.log("Product for image", product);
    console.log("Image src", getProductImageSrc(product));
    function getProductImageSrc(item: any): string {
      if (typeof item.cover === "string" && item.cover.trim() !== "") return item.cover;
      if (item.imgs?.previews?.[0]) return item.imgs.previews[0];
      if (item.imgs?.thumbnails?.[0]) return item.imgs.thumbnails[0];
      if (item.mainImage && typeof item.mainImage === "object" && item.mainImage.url) return item.mainImage.url;
      if (Array.isArray(item.images) && item.images.length > 0 && item.images[0]?.url) return item.images[0].url;
      return "/placeholder.svg";
    }
    const [imgSrc, setImgSrc] = useState(getSafeImageSrc(getProductImageSrc(normalizedProduct)));

    const isMobile = useIsMobile();

    const reviewsCount = product?.reviews?.length || 0;
    const totalRating = product?.reviews?.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      reviewsCount > 0
        ? Math.round((totalRating / reviewsCount) * 2) / 2
        : 0;

    const calculateDiscount = () => {
      if (product?.discountPercentage) return product.discountPercentage;
      if (!product?.oldPrice || product.oldPrice <= product.price) return 0;
      return Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      );
    };

    const discountPercentage = calculateDiscount();

    const handleWishlist = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        toast({
          title: "Connexion requise",
          description:
            "Veuillez vous connecter pour ajouter ce produit à votre liste de souhaits.",
          variant: "destructive",
        });
        return;
      }
    };

    const handleAddToCart = useCallback(
      async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAddingToCart || !product?.inStock) return;

        try {
          setIsAddingToCart(true);

          dispatch(
            addItemToCart({
              id: Number(product._id),
              title: product.designation,
              price: product.price,
              discountedPrice: product.oldPrice && product.oldPrice > product.price ? product.price : product.price,
              quantity: 1,
              imgs: product.mainImage
                ? { thumbnails: [product.mainImage.url], previews: [product.mainImage.url] }
                : undefined,
              type: type === "pack" ? "Pack" : "Product",
              image: getProductImageSrc(normalizedProduct), // <-- HERE
            })
          );

          toast({
            title: "Ajouté au panier",
            description: `${product.designation} a été ajouté à votre panier`,
            variant: "default",
          });
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Impossible d'ajouter le produit au panier",
            variant: "destructive",
          });
        } finally {
          setIsAddingToCart(false);
        }
      },
      [product, type, dispatch, isAddingToCart, normalizedProduct]
    );

    
    return (
      <div
        className={cn(
          "relative flex flex-col h-full bg-white rounded-md overflow-hidden border transition-all duration-300",
          isHovered
            ? "border-primary/40 shadow-lg translate-y-[-4px]"
            : "border-gray-200",
          "hover:border-primary/20 hover:shadow-lg group"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`${product?.designation || "Product"} card`}
      >
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between p-2">
          <div className="space-y-1 text-white">
            {isFlashSale && (
              <span className="py-0.25 px-1 text-[14px] font-medium bg-red-500 rounded-sm block animate-pulse">
                VENTE FLASH
              </span>
            )}
            {(showDiscountBadge && discountPercentage > 0) && (
              <span className="py-0.25 px-1 text-[14px] font-medium bg-[#ef837b] rounded-sm block">
                -{discountPercentage}%
              </span>
            )}
          </div>

          <div className="space-y-1 text-white">
            {type === "pack" && (
              <span className="py-0.25 px-1 text-[8px] font-medium bg-[#A786DF] rounded-sm block">
                Pack
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/${typeRef}/${product?.slug}`}
          className="flex flex-col flex-1 h-full"
          aria-label={`View details for ${product?.designation || "product"}`}
        >
          <div className="relative flex items-center justify-center p-2 sm:p-4 aspect-square bg-gray-50">
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
                  "object-contain h-full w-auto max-w-full transition-all duration-500",
                  isHovered ? "scale-110" : "scale-100"
                )}
                src={imgSrc}
                alt={product?.designation || "Product image"}
                width={500}
                height={500}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  if (fallbackImage && imgSrc !== fallbackImage) {
                    setImgSrc(getSafeImageSrc(fallbackImage));
                  } else if (imgSrc && !imgSrc.startsWith("/")) {
                    setImgSrc(getSafeImageSrc(imgSrc));
                  }
                }}
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

          <div className="flex flex-col flex-1 px-3 pt-4 pb-4 text-center sm:px-4 sm:pt-5">
            {product?.brand && (
              <div className="mb-1.5">
                <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {product.brand}
                </span>
              </div>
            )}
            
            <h3 className="mb-2.5 text-sm font-medium text-center w-full transition-colors sm:text-base line-clamp-2 group-hover:text-primary">
              {product?.designation}
            </h3>

            <div className="flex flex-row flex-nowrap items-center justify-center gap-2 mb-2">
              <span className="text-base font-semibold text-[#EF837B]">
                {formatCurrency(product?.price)}
              </span>
              {(product?.oldPrice || (isFlashSale && product?.price < product?.oldPrice)) && (
                <span className="mt-1 text-sm text-gray-400 line-through">
                  {formatCurrency(product?.oldPrice)}
                </span>
              )}
            </div>

            <div className="flex flex-row flex-nowrap items-center justify-center mb-3">
              <Rate
                value={averageRating}
                disabled
                allowHalf
                className="text-xs sm:text-sm custom-rate"
              />
              <span className="ml-2 text-xs text-gray-400">
                ({reviewsCount})
              </span>
            </div>
          </div>
        </Link>

        {/* --- FIX: Always show the Add to Cart button --- */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-3 bg-white transition-all duration-300 z-30",
            "translate-y-0 opacity-100"
          )}
        >
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
              {isAddingToCart ? "Ajout en cours..." : 
                product?.inStock ? "Ajouter au panier" : "Indisponible"}
            </span>
          </Button>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;