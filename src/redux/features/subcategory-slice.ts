import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SubCategory } from '../../types/subcategory';
import * as subcategoryService from '../../services/subcategories';

interface SubCategoryState {
  subcategories: SubCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: SubCategoryState = {
  subcategories: [],
  loading: false,
  error: null,
};

export const fetchAllSubCategories = createAsyncThunk(
  'subcategories/fetchAll',
  async () => {
    return await subcategoryService.getAllSubCategories();
  }
);

const subcategorySlice = createSlice({
  name: 'subcategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(fetchAllSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subcategories';
      });
  },
});

export default subcategorySlice.reducer;