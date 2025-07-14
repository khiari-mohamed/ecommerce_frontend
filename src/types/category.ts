// src/types/category.ts

/**
 * Category Image Type
 */
export type CategoryImage = {
  url: string;
  img_id: string;
};

/**
 * Base Product Reference Type (can be expanded in product.ts)
 */
type ProductReference = {
  _id: string;
  name: string;
  slug?: string;
  price?: number;
};

/**
 * Base SubCategory Reference Type (can be expanded in subCategory.ts)
 */
type SubCategoryReference = {
  subCategories(subCategories: any): unknown;
  _id: string;
  designation?: string;
  designation_fr?: string;
  name?: string;
  slug?: string;
};

/**
 * Main Category Type
 * Maintains all existing fields while adding proper typing
 */
export type Category = {
  // Core Identifiers
  _id: string;
  id?: string; // Sometimes string, sometimes number in backend

  // Designation Fields
  designation?: string;
  designation_fr?: string;
  title?: string; // Maintained for frontend static data merging

  // URL/Slug Fields
  slug: string;

  // Image Fields
  image?: CategoryImage;
  cover?: string;
  product_liste_cover?: string | null;
  alt_cover?: string | null;
  description_fr?: string | null;
  description_cover?: string | null;

  // Relationships
  products?: string[] | ProductReference[];    // Can be IDs or populated objects
  subCategories?: string[] | SubCategoryReference[]; // Can be IDs or populated objects
  subcategories?: string[] | SubCategoryReference[]; // Alias for lowercase usage

  // Timestamps
  createdAt?: string | Date;
  updatedAt?: string | Date;

  // Metadata (from your backend snapshot)
  meta?: any;
  content_seo?: string | null;
  review?: any;
  aggregateRating?: any;
  nutrition_values?: string;
  questions?: string;
  more_details?: string;
  zone1?: string;
  zone2?: string;
  zone3?: string;

  // Audit Fields
  created_by?: string;
  updated_by?: string;
};

/**
 * Type guard for populated products
 */
export function isPopulatedProduct(product: string | ProductReference): product is ProductReference {
  return typeof product !== 'string';
}

/**
 * Type guard for populated subCategories
 */
export function isPopulatedSubCategory(subCat: string | SubCategoryReference): subCat is SubCategoryReference {
  return typeof subCat !== 'string';
}
