import { Product } from "@/types/product";

/**
 * Normalize image URLs for next/image and fallback to a placeholder if missing.
 * Handles:
 *  - Empty/undefined/null
 *  - Windows backslashes
 *  - Absolute localhost URLs (converts to relative)
 *  - Ensures leading slash for relative paths
 *  - Leaves valid external URLs as-is
 */
export function getValidImageSrc(product: Product, key: number, src?: string): string {
  if (!src || typeof src !== "string" || src.trim() === "") {
    return "/images/placeholder.png";
  }
  let cleanSrc = src.trim().replace(/\\\\/g, "/").replace(/\\/g, "/");

  // If it's an absolute localhost URL, convert to relative
  if (cleanSrc.startsWith("http://localhost") || cleanSrc.startsWith("https://localhost")) {
    try {
      const url = new URL(cleanSrc);
      cleanSrc = url.pathname;
    } catch {
      return "/images/placeholder.png";
    }
  }

  // If it's still an absolute URL (external), return as is (but you must configure the domain in next.config.js)
  if (cleanSrc.startsWith("http")) {
    return cleanSrc;
  }

  // Ensure it starts with a slash
  if (!cleanSrc.startsWith("/")) {
    cleanSrc = "/" + cleanSrc;
  }
  return cleanSrc;
}