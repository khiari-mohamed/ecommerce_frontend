export interface Blog {
  _id: string;
  title: string;
  slug: string;
  cover?: { url: string; img_id?: string } | string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
  id?: string;
  designation_fr?: string;
  description?: string;
  publier?: string;
  meta_description_fr?: string;
  alt_cover?: string;
  description_cover?: string;
  meta?: string;
  content_seo?: string;
  review?: string | null;
  aggregateRating?: string | null;
  author?: string;
  author_role?: string;
}