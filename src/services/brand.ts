// src/services/brands.ts
import axios from '@/lib/axios';
import { Brand } from '@/types/brand';

export const getAllBrands = async (): Promise<Brand[]> => {
  const res = await axios.get('/brands');
  return res.data;
};

export const getBrandById = async (id: string): Promise<Brand> => {
  const res = await axios.get(`/brands/${id}`);
  return res.data;
};

export const getAromasForBrand = async (brandId: string) => {
  const res = await axios.get(`/brands/${brandId}/aromas`);
  return res.data;
};