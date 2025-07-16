import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  items: any[];
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async () => {
  const response = await axios.get('http://192.168.1.13:3000/orders');
  return response.data;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllOrders.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch orders';
      });
  },
});

export default orderSlice.reducer;
