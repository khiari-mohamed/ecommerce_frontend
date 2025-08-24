/**
 * Utility for handling NEW backend-served images from dashboard
 * Keeps existing image logic untouched
 */

export function getBackendImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath || typeof imagePath !== 'string') {
    return '';
  }

  const cleanPath = imagePath.replace(/^\/+/, '');
  
  // Only handle NEW backend images with month/year pattern (August2025, etc.)
  if (cleanPath.startsWith('produits/') && /produits\/[A-Za-z]+\d{4}\//.test(cleanPath)) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${backendUrl}/${cleanPath}`;
  }
  
  return '';
}

export function resolveImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '/images/placeholder.png';
  
  // Try backend first for new images
  const backendUrl = getBackendImageUrl(imagePath);
  if (backendUrl) return backendUrl;
  
  // Fallback to existing logic for old images
  if (imagePath.startsWith('/') || imagePath.startsWith('http')) {
    return imagePath;
  }
  
  return '/' + imagePath;
}