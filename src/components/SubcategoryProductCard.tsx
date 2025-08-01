"use client";
import Image from "next/image";
import Rate from "antd/es/rate";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formattedPrice";
import { useModalContext } from "@/app/context/QuickViewModalContext";

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
  const router = useRouter();
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

  // Modal context for Quick View
  const { openModal } = useModalContext();

  // Helper to get the correct image URL from cover
  // Helper to get the correct image URL from cover (local public/produits support)
  const getProductImageUrl = (product: any) => {
    let cover = product.cover;
    if (cover && typeof cover === 'string' && cover.trim() !== '') {
      if (cover.startsWith('http')) return cover;
      if (cover.startsWith('produits/')) return `/${cover.replace(/^\/+/, '')}`;
      return cover;
    }
    return '/images/placeholder.png';
  };

  // Normalize product for quick view/wishlist
  const normalizeProduct = (product: any) => {
    const imageUrl = getProductImageUrl(product);
    return {
      ...product,
      price: Number(product.price ?? product.prix) || 0,
      discountedPrice: Number(product.discountedPrice ?? product.promo ?? product.price ?? product.prix) || 0,
      title: product.title ?? product.designation_fr ?? product.designation ?? product.name ?? "Produit",
      designation: product.designation ?? product.designation_fr ?? product.title ?? product.name ?? "Produit",
      cover: product.cover ?? imageUrl,
      imgs: { thumbnails: [imageUrl], previews: [imageUrl] },
      mainImage: { url: imageUrl },
      images: [],
      _id: product._id ?? product.id,
      inStock: product.inStock,
      brand: product.brand,
      slug: product.slug,
    };
  };

  // Heart (wishlist) and Eye (quick view) handlers
  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(addItemToWishlist({ ...normalizeProduct(product), status: "available", quantity: 1 }));
    toast({ title: "Ajouté aux favoris", description: `${name} a été ajouté à vos favoris`, variant: "default" });
  };
  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(updateQuickView(normalizeProduct(product)));
    openModal();
  };

  const handleAddToCart = useCallback(() => {
    if (isAddingToCart || !product?.inStock) return;
    setIsAddingToCart(true);
    dispatch(
      addItemToCart({
        id: String(product.id ?? product._id ?? ""),
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
        "group relative overflow-hidden h-full flex flex-col shadow-none bg-white rounded-xl",
      )}
      style={{
        border: '1.5px solid #fff',
        transition: 'border-color 0.3s, border-width 0.3s',
      }}
      onMouseEnter={e => {
        setIsHovered(true);
        (e.currentTarget as HTMLDivElement).style.borderColor = '#ff6600';
        (e.currentTarget as HTMLDivElement).style.borderWidth = '2px';
      }}
      onMouseLeave={e => {
        setIsHovered(false);
        (e.currentTarget as HTMLDivElement).style.borderColor = '#fff';
        (e.currentTarget as HTMLDivElement).style.borderWidth = '1.5px';
      }}
      aria-label={`${name} card`}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discountPercentage > 0 && (
          <span
            style={{
              background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
              color: '#fff',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.75rem',
              boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)',
              zIndex: 20,
              position: 'relative',
              display: 'inline-block',
            }}
            className="text-xs font-bold px-2 py-1"
          >
            -{discountPercentage}%
          </span>
        )}
      </div>
      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center"
          onClick={handleWishlist}
          aria-label="Ajouter aux favoris"
        >
          <Heart className="w-4 h-4 text-orange-500" />
        </button>
        <button
          className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center"
          onClick={handleQuickView}
          aria-label="Aperçu rapide"
        >
          <Eye className="w-4 h-4 text-orange-500" />
        </button>
      </div>
      <div className="p-4 flex flex-col h-full">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <Image
            src={imageSrc}
            alt={name}
            width={250}
            height={250}
            className="w-full h-full object-cover"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {!product?.inStock && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
              <div className="w-full px-4 py-1.5 text-sm font-medium text-center text-white shadow-md bg-[#FF4301] md:text-base transform rotate-[-5deg]">
                Rupture de Stock
              </div>
            </div>
          )}
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
        <div className="flex items-center gap-2 mb-4 justify-center">
          <span style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 700, fontSize: '1.25rem' }}>
            {formatCurrency(isNaN(price) ? 0 : price)}
          </span>
          {oldPrice > price && !isNaN(oldPrice) && (
            <span className="text-sm text-gray-500 line-through">
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
        <h3
          className="mb-2 text-sm font-medium text-center w-full transition-colors sm:text-base group-hover:text-primary line-clamp-2"
          style={{ minHeight: '3.4em', maxHeight: '3.4em', overflow: 'hidden', display: 'block' }}
        >
          <Link
            href={`/shop/${product?.slug}`}
            className="hover:text-orange-600 transition-colors duration-200 w-full block"
            style={{ textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', whiteSpace: 'normal' }}
          >
            {name}
          </Link>
        </h3>
        {/* Add to Cart Button */}
        <button className="w-full font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center" style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600, fontSize: '1rem' }} onClick={handleAddToCart} disabled={!product?.inStock || isAddingToCart}>
          <ShoppingCart className="w-4 h-4 mr-2 text-white" />
          {isAddingToCart ? "Ajout en cours..." : product?.inStock ? "Ajouter au panier" : "Indisponible"}
        </button>
      </div>
    </div>
  );
}