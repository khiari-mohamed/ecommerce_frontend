/**
 * Non-Product Image Utility
 * Handles both old (public folder) and new (backend server) images for non-product content
 * Works for: blogs, categories, brands, announcements, slides, services, etc.
 */

const BACKEND_URL = 'http://145.223.118.9:5000';

/**
 * Enhanced image URL with backend fallback for new non-product images
 * Detects backend-served images by month/year pattern (aout2025, August2025, etc.)
 */
export function getEnhancedNonProductImageSrc(src: string | undefined | null): string {
  if (!src || typeof src !== 'string' || src.trim() === '') {
    return '/images/placeholder.png';
  }

  // If it's already a full URL, return as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Check if this is a NEW backend-served image
  // Pattern 1: /blogs/August2025/ or /blogs/aout2025/
  if (/\/blogs\/[a-zA-Z]+\d{4}\//.test(src)) {
    return `${BACKEND_URL}${src}`;
  }
  
  // Pattern 2: /brands/August2025/ or /categories/August2025/
  if (/\/(brands|categories|annonces|slides|services)\/[a-zA-Z]+\d{4}\//.test(src)) {
    return `${BACKEND_URL}${src}`;
  }

  // For old images, return as is (they're served from public folder)
  return src;
}

/**
 * Check if a non-product image should be unoptimized (for Next.js Image component)
 */
export function shouldUnoptimizeNonProductImage(src: string | undefined | null): boolean {
  if (!src || typeof src !== 'string') return false;
  
  // Check for backend-served image patterns
  return /\/(blogs|brands|categories|annonces|slides|services)\/[a-zA-Z]+\d{4}\//.test(src);
}

/**
 * Specific function for category images to handle both old and new images
 */
export function getEnhancedCategoryImageSrc(category: any): string {
  // Handle different category image structures
  let imageSrc = '';
  
  // Check for image.url (new structure)
  if (category.image?.url) {
    imageSrc = category.image.url;
  }
  // Check for direct image field
  else if (category.image && typeof category.image === 'string') {
    imageSrc = category.image;
  }
  // Check for cover field
  else if (category.cover) {
    imageSrc = category.cover;
  }
  // Fallback to static image from categoryData merge
  else if (category.img) {
    imageSrc = category.img;
  }
  
  if (!imageSrc) {
    return '/images/placeholder.png';
  }

  // If it's already a full URL, return as is
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
    return imageSrc;
  }

  // Check if this is a NEW backend-served category image
  if (imageSrc.startsWith('/categories/') && /\/categories\/[a-zA-Z]+\d{4}\//.test(imageSrc)) {
    return `${BACKEND_URL}${imageSrc}`;
  }

  // For old category images, return as is (they're served from public folder)
  return imageSrc;
}

/**
 * Specific function for brand images to handle both old and new images
 */
export function getEnhancedBrandImageSrc(brand: any): string {
  // Handle different brand image structures
  let imageSrc = '';
  
  // Check for cover field first (new brands use this)
  if (brand.cover) {
    imageSrc = brand.cover;
  }
  // Check for logo field (most common for old brands)
  else if (brand.logo) {
    imageSrc = brand.logo;
  }
  // Check for image.url (new structure)
  else if (brand.image?.url) {
    imageSrc = brand.image.url;
  }
  // Check for direct image field
  else if (brand.image && typeof brand.image === 'string') {
    imageSrc = brand.image;
  }
  
  if (!imageSrc) {
    return '/images/placeholder.png';
  }

  // If it's already a full URL, return as is
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
    return imageSrc;
  }

  // Check if this is a NEW backend-served brand image
  if (imageSrc.startsWith('/brands/') && /\/brands\/[a-zA-Z]+\d{4}\//.test(imageSrc)) {
    return `${BACKEND_URL}${imageSrc}`;
  }

  // For old brand images that don't start with /, add the /images/brand/ prefix
  if (!imageSrc.startsWith('/') && !imageSrc.includes('/brands/')) {
    return `/images/brand/${imageSrc}`;
  }

  // For old brand images, return as is (they're served from public folder)
  return imageSrc;
}

/**
 * Convenience function that returns both enhanced src and unoptimized flag for non-product images
 */
export function getNonProductImageProps(src: string | undefined | null): { 
  src: string; 
  unoptimized: boolean; 
} {
  const enhancedSrc = getEnhancedNonProductImageSrc(src);
  return {
    src: enhancedSrc,
    unoptimized: shouldUnoptimizeNonProductImage(src)
  };
}