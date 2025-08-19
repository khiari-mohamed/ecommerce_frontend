import axiosInstance from "@/lib/axios";
import type { TopPromotion } from "@/types/top-promotion";

export async function getTopPromotions(): Promise<TopPromotion[]> {
  try {
    const response = await axiosInstance.get("/top-promotions?populate=product");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching top promotions:", error);
    return [];
  }
}