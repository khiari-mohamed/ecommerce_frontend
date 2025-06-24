import axios from 'axios';
import { Review } from "../types/reviews";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const res = await axios.get<Review[]>(`${API_BASE}/reviews/product/${productId}`);
  return res.data;
}

export async function postReview(review: Partial<Review>): Promise<Review> {
  const res = await axios.post<Review>(`${API_BASE}/reviews`, review);
  return res.data;
}

export async function getAllReviews(): Promise<Review[]> {
  const res = await axios.get<Review[]>(`${API_BASE}/reviews`);
  return res.data;
}