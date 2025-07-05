import { Product } from "@/types/product";

/**
 * Returns a robust, normalized image URL for any product shape or direct string.
 * Handles: image, img, cover, imgs.previews[0], imgs.thumbnails[0], mainImage.url, images[0].url, etc.
 * Accepts: product object, minimal object, or string.
 */
export function getProductImageSrc(item: Partial<Product> | string | any): string {
  // If it's a string, treat as direct URL
  if (typeof item === "string") return normalizeImageUrl(item);

  // If it's an object, check all possible fields
  if (item) {
    // 1. Direct image fields (cart/wishlist/minimal shape)
    if (typeof item.image === "string" && item.image.trim() !== "") return normalizeImageUrl(item.image);
    if (typeof item.img === "string" && item.img.trim() !== "") return normalizeImageUrl(item.img);

    // 2. Full product shape (already implemented)
    if (typeof item.cover === "string" && item.cover.trim() !== "") return normalizeImageUrl(item.cover);
    if (item.imgs?.previews?.[0]) return normalizeImageUrl(item.imgs.previews[0]);
    if (item.imgs?.thumbnails?.[0]) return normalizeImageUrl(item.imgs.thumbnails[0]);
    if (item.mainImage && typeof item.mainImage === "object" && item.mainImage.url) return normalizeImageUrl(item.mainImage.url);
    if (Array.isArray(item.images) && item.images.length > 0 && item.images[0]?.url) return normalizeImageUrl(item.images[0].url);

    // 3. Other possible fields (paranoid coverage)
    if (typeof item.photo === "string" && item.photo.trim() !== "") return normalizeImageUrl(item.photo);
    if (typeof item.picture === "string" && item.picture.trim() !== "") return normalizeImageUrl(item.picture);
    if (item.pictures?.[0]) return normalizeImageUrl(item.pictures[0]);
    if (item.photos?.[0]) return normalizeImageUrl(item.photos[0]);
  }

  // Fallback
  return "/images/placeholder.png";
}

/**
 * Normalizes a single image URL: adds leading slash if needed, passes through full URLs, returns placeholder if empty.
 * Also handles public/produits/... paths.
 */
export function normalizeImageUrl(url?: string): string {
  if (!url || typeof url !== "string" || url.trim() === "") return "/images/placeholder.png";
  let cleanSrc = url.trim().replace(/\+/g, "/").replace(/\\/g, "/");

  // If it's an absolute URL, return as is
  if (cleanSrc.startsWith("http://") || cleanSrc.startsWith("https://")) return cleanSrc;

  // If it starts with /, it's already relative to public
  if (cleanSrc.startsWith("/")) return cleanSrc;

  // If it looks like produits/..., images/..., uploads/..., static/..., add leading slash
  if (cleanSrc.match(/^(produits|images|uploads|static)\//)) return "/" + cleanSrc;

  // Otherwise, just add leading slash
  return "/" + cleanSrc;
}
