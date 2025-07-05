// src/utils/image.ts

import { Product } from "@/types/product";

/**
 * Returns a robust, normalized image URL for a product.
 * Checks cover, imgs.previews[0], imgs.thumbnails[0], mainImage.url, images[0].url, and falls back to placeholder.
 */
export function getProductImageSrc(item: Partial<Product>): string {
  if (typeof item.cover === "string" && item.cover.trim() !== "") return normalizeImageUrl(item.cover);
  if (item.imgs?.previews?.[0]) return normalizeImageUrl(item.imgs.previews[0]);
  if (item.imgs?.thumbnails?.[0]) return normalizeImageUrl(item.imgs.thumbnails[0]);
  if (item.mainImage && typeof item.mainImage === "object" && item.mainImage.url) return normalizeImageUrl(item.mainImage.url);
  if (Array.isArray(item.images) && item.images.length > 0 && item.images[0]?.url) return normalizeImageUrl(item.images[0].url);
  return "/images/placeholder.png";
}

/**
 * Normalizes a single image URL: adds leading slash if needed, passes through full URLs, returns placeholder if empty.
 */
export function normalizeImageUrl(url?: string): string {
  if (!url || typeof url !== "string" || url.trim() === "") return "/images/placeholder.png";
  let cleanSrc = url.trim().replace(/\\+/g, "/");
  if (cleanSrc.startsWith("http://") || cleanSrc.startsWith("https://")) return cleanSrc;
  if (!cleanSrc.startsWith("/")) cleanSrc = "/" + cleanSrc;
  return cleanSrc;
}
