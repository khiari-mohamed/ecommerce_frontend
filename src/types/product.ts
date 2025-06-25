export interface ProductImage {
  url: string;
  img_id?: string;
}

export type Review = {
  rating: number;
  _id: string;
  id: string;
  user_id: string;
  product_id: string;
  stars: number;
  comment: string;
  publier: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  aroma_ids: string[];
   designation_fr?: string;  // Changed to optional
  promo?: number;           // Changed to optional
  prix?: number;            // Changed to optional
  gallery?: boolean;
  title: string;
  price: number;
  cover?: string;
  meta_description_fr?: string;
  discountedPrice: number;
  id: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  currency: string;

  _id: string;
  designation: string;
  slug: string;
  oldPrice?: number;
  mainImage: ProductImage;
  images?: ProductImage[];
  inStock?: boolean;
  reviews?: Review[];
  features?: string[];
  brand?: string;
  smallDescription?: string;
  description?: string;
  category?: string | { _id: string; designation: string };
  subCategory?: Array<string | { _id: string; designation: string }>;
  sous_categorie_id?: string;
  venteflashDate?: Date;
  isFlashSale?: boolean;
  discountPercentage?: number;
  type: string;
  isNewProduct?: boolean; // from new_product
  isBestSeller?: boolean; // from best_seller
  isOutOfStock?: boolean; // from rupture
  isPublished?: boolean;  // from publier
  aggregateRating?: number; // parse from note or aggregateRating
  promoExpirationDate?: Date; // from promo_expiration_date
  createdAt?: Date | string;
nutrition_values?: string;
questions?: string;
};

export interface FlashSaleProduct extends Product {
  endTime: string;
  originalPrice: number;
  type: string;
}

export interface ProductReference {
  _id: string;
  designation: string;
  slug: string;
  price?: number;
  mainImage: ProductImage;
}