import axios from '../lib/axios';
import { SubCategory } from '../types/subcategory';

// Get all subcategories
export const getAllSubCategories = async (): Promise<SubCategory[]> => {
  const res = await axios.get('/admin/subcategories/get/all');
  return res.data.data;
};

// Get subcategories by category ID
export const getSubCategoriesByCategory = async (categoryId: string): Promise<SubCategory[]> => {
  const res = await axios.get(`/admin/subcategories/get/by-category/${categoryId}`);
  return res.data.data;
};

// Create a new subcategory
export const createSubCategory = async (payload: { name: string; categoryId: string }) => {
  const res = await axios.post('/admin/subcategories/new', payload);
  return res.data;
};

// Update a subcategory
export const updateSubCategory = async (id: string, payload: { name?: string; categoryId?: string }) => {
  const res = await axios.put(`/admin/subcategories/update/${id}`, payload);
  return res.data;
};

// Delete a subcategory
export const deleteSubCategory = async (id: string) => {
  const res = await axios.delete(`/admin/subcategories/delete/${id}`);
  return res.data;
};

// Get subcategory by slug
export const getSubCategoryBySlug = async (slug: string): Promise<SubCategory> => {
  const res = await axios.get(`/subcategories/slug/${slug}`);
  return res.data;
};