// src/services/aromas.ts
import axios from '@/lib/axios';
import { Aroma } from '@/types/aroma';

export const getAllAromas = async (): Promise<Aroma[]> => {
  const res = await axios.get('/aromas');
  return res.data;
};

export const getAromaById = async (id: string): Promise<Aroma> => {
  const res = await axios.get(`/aromas/${id}`);
  return res.data;
};

export const getAromasByBrand = async (brandId: string): Promise<Aroma[]> => {
  const res = await axios.get(`/aromas/brand/${brandId}`);
  return res.data;
};
export const getAromasByCategory = async (categoryId: string): Promise<Aroma[]> => {
  const res = await axios.get(`/aromas/category/${categoryId}`);
  return res.data;
};