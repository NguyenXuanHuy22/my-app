import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

// ⏬ Fetch API trong thunk
export const fetchProducts = createAsyncThunk<Product[]>('products/fetch', async () => {
  const res = await fetch('http://192.168.1.13:3000/products');
  if (!res.ok) throw new Error('Failed to fetch');
  return await res.json();
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      });
  },
});

export default productsSlice.reducer;
export const selectProducts = (state: RootState) => state.products.products;

export const selectProductById = (id: string) => (state: RootState) => 
  state.products.products.find(product => product.id === id);