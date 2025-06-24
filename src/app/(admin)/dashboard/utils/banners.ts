// /utils/banners.ts
import { Banner } from "@/types/banner";

export async function getAllBanners(): Promise<Banner[]> {
  const res = await fetch("http://localhost:5000/banners", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch banners");
  return res.json();
}

export async function addBanner(banner: Banner): Promise<void> {
  const res = await fetch("http://localhost:5000/banners", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(banner),
  });
  if (!res.ok) throw new Error("Failed to add banner");
}

export async function updateBanner(id: string, banner: Banner): Promise<void> {
  const res = await fetch(`http://localhost:5000/banners/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(banner),
  });
  if (!res.ok) throw new Error("Failed to update banner");
}

export async function deleteBanner(id: string): Promise<void> {
  const res = await fetch(`http://localhost:5000/banners/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete banner");
}