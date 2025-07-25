export interface MusculationProduct {
  _id: string;
  id: string;
  sous_categorie_id: string;
  designation_fr: string;
  cover: string;
  qte: string;
  prix_ht?: string;
  prix: string;
  promo_ht?: string;
  promo?: string;
  description_fr: string;
  publier: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  code_product?: string;
  slug: string;
  pack: string;
  brand_id: string;
  new_product: string;
  best_seller: string;
  gallery: string;
  note: string;
  meta_description_fr: string;
  promo_expiration_date?: string;
  rupture: string;
  alt_cover?: string;
  description_cover?: string;
  meta?: string;
  content_seo?: string;
  review?: string;
  aggregateRating?: string;
  nutrition_values?: string;
  questions?: string;
  zone1: string;
  zone2: string;
  zone3: string;
  zone4: string;
  categorie_id?: string;
  description?: string;
  more_details?: string;
  // Add any other fields as needed
}