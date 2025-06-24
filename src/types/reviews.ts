export interface Review {
  rating: number;
  id: string;
  user_id: string;
  product_id: string;
   _id?: string;
  stars: string; // backend uses string, convert to number in frontend if needed
  comment: string | null;
  publier: string;
  created_at: string;
  updated_at: string;
}