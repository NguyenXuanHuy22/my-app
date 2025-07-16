// redux/slices/productsSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  sizes: string[];
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

const API_URL = 'http://192.168.1.11:3000/products';

// Fetch all
export const fetchProducts = createAsyncThunk<Product[]>('products/fetch', async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch');
  return await res.json();
});

// Add product
export const addProduct = createAsyncThunk<Product, Product>('products/add', async (product) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to add product');
  return await res.json();
});

// Update product
export const updateProduct = createAsyncThunk<Product, Product>('products/update', async (product) => {
  const res = await fetch(`${API_URL}/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return await res.json();
});

// Delete product
export const deleteProduct = createAsyncThunk<string, string>('products/delete', async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
  return id;
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
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductById = (id: string) => (state: RootState) =>
  state.products.products.find(product => product.id === id);
