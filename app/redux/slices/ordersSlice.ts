import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Kiểu chi tiết đơn hàng
export interface OrderDetail {
  orderDetailId: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  subtotal: number;
  date: string;
}

// Kiểu đơn hàng
export interface Order {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  date: string;
  items: OrderDetail[];
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  updating: boolean; // trạng thái khi update đơn hàng
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  updating: false,
};

// Fetch toàn bộ đơn hàng
export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async () => {
  const response = await axios.get('http://192.168.1.13:3000/orders');
  return response.data as Order[];
});

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, newStatus }: { orderId: string; newStatus: string }) => {
    const res = await axios.patch(`http://192.168.1.13:3000/orders/${orderId}`, {
      status: newStatus,
    });
    return res.data as Order;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch all
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
        state.error = action.error?.message || 'Lỗi khi tải đơn hàng';
      })

      // Update order status
      .addCase(updateOrderStatus.pending, state => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updating = false;
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error?.message || 'Lỗi khi cập nhật trạng thái đơn hàng';
      });
  },
});

export default orderSlice.reducer;
