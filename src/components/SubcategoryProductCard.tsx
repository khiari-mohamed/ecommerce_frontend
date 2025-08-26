"use client";
import Image from "next/image";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from "@/hooks/use-toast";
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
  const getProductImageUrl = (product: any) => {
    let cover = product.cover;
    if (cover && typeof cover === 'string' && cover.trim() !== '') {
      if (cover.startsWith('http')) return cover;
      if (cover.startsWith('produits/')) return `/${cover.replace(/^\/+/, '')}`;
      return cover;
    }
    return '/images/placeholder.png';
  };

  // Enhanced image URL with backend fallback for new images
  const getEnhancedImageSrc = (src: string) => {
    // Check if this is a NEW backend-served image (contains August2025 pattern)
    if (src && src.includes('August2025')) {
      const backendUrl = 'https://145.223.118.9:5000';
      return `${backendUrl}${src}`;
    }
    
    return src;
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
    <Card
      className="group relative overflow-hidden h-full flex flex-col shadow-none bg-white border-0"
      onMouseEnter={e => {
        setIsHovered(true);
      }}
      onMouseLeave={e => {
        setIsHovered(false);
      }}
      aria-label={`${name} card`}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discountPercentage > 0 && (
          <Badge style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }} className="text-xs font-bold px-2 py-1">
            -{discountPercentage}%
          </Badge>
        )}
        <Badge style={{ background: '#1cac54', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(28,172,84,0.15)' }} className="text-xs font-bold px-2 py-1 mt-1">
          New
        </Badge>
      </div>
      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full focus:outline-none" onClick={handleWishlist}>
          <Heart className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full focus:outline-none" onClick={handleQuickView}>
          <Eye className="w-4 h-4" />
        </Button>
      </div>
      <CardContent className="flex flex-col h-full p-4">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <Image
            src={getEnhancedImageSrc(imageSrc)}
            alt={name}
            fill
            className="w-full h-full object-cover"
            loading="lazy"
            sizes="100vw"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)}
            unoptimized={imageSrc?.includes('August2025')}
          />
          {/* Overlay gradient removed on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300" />
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
        {/* Product Info */}
        <div className="flex-grow flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors duration-300 min-h-[2.5rem] text-center">
            <Link href={`/shop/${product?.slug}`} className="focus:outline-none">
              {name}
            </Link>
          </h3>
          {/* Stars */}
          <div className="flex items-center justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Image key={i} src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} loading="lazy" sizes="14px" />
            ))}
            <span className="text-xs text-gray-500 ml-1">({reviewsCount})</span>
          </div>
          {/* Price */}
          <div className="flex flex-col items-center gap-1 mb-3 justify-center">
            <span className="text-sm sm:text-lg font-bold text-center" style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              {formatCurrency(isNaN(price) ? 0 : price)}
            </span>
            {oldPrice > price && !isNaN(oldPrice) && (
              <span className="text-xs sm:text-sm text-gray-500 line-through text-center">
                {formatCurrency(oldPrice)}
              </span>
            )}
          </div>
        </div>
        {/* Add to Cart Button */}
        <Button className="w-full font-medium py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-xs sm:text-sm focus:outline-none" style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600 }} onClick={handleAddToCart} disabled={!product?.inStock || isAddingToCart}>
          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-white" />
          <span className="hidden sm:inline">{isAddingToCart ? "Ajout en cours..." : product?.inStock ? "Ajouter au panier" : "Indisponible"}</span>
          <span className="sm:hidden">{isAddingToCart ? "Ajout..." : product?.inStock ? "Ajouter" : "Indisponible"}</span>
        </Button>
      </CardContent>
    </Card>
  );
}