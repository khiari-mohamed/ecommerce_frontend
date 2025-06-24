import axiosInstance from "@/lib/axios";

export async function fetchCategories(): Promise<{ _id: string; designation: string }[]> {
  try {
    const res = await axiosInstance.get("/categories");
    return res.data?.categories || [];
  } catch {
    return [];
  }
}