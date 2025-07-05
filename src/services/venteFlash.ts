import axios from "axios";
import { VenteFlash } from "../types/venteFlash";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/vente-flash`;

function normalizeVenteFlash(item: any): VenteFlash {
  return {
    ...item,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

export const getVenteFlashList = async (): Promise<VenteFlash[]> => {
  try {
    const response = await axios.get(API_URL);
    return Array.isArray(response.data)
      ? response.data.map(normalizeVenteFlash)
      : [];
  } catch (error) {
    console.error("Error fetching vente flash:", error);
    return [];
  }
};

export const getVenteFlashById = async (id: string): Promise<VenteFlash | null> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data ? normalizeVenteFlash(response.data) : null;
  } catch (error) {
    console.error("Error fetching vente flash by id:", error);
    return null;
  }
};

export const createVenteFlash = async (payload: Partial<VenteFlash>) => {
  const response = await axios.post(API_URL, payload);
  return response.data;
};

export const updateVenteFlash = async (id: string, payload: Partial<VenteFlash>) => {
  const response = await axios.put(`${API_URL}/${id}`, payload);
  return response.data;
};

export const deleteVenteFlash = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};