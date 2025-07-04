import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// 👉 Interface User
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  role: string;
}

// 👉 Interface AuthState
interface AuthState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const API = 'http://192.168.1.6:3000'; // Sử dụng IP LAN nếu dùng thiết bị thật

// ✅ Hàm tạo ID ngẫu nhiên
const generateId = () => Math.random().toString(36).substring(2, 10);

// ✅ Thunk: Lấy toàn bộ người dùng
export const fetchUsers = createAsyncThunk<User[]>('auth/fetchUsers', async () => {
  const res = await axios.get(`${API}/users`);
  return res.data;
});

// ✅ Thunk: Đăng ký người dùng mới
export const registerUser = createAsyncThunk<User, User>(
  'auth/registerUser',
  async (user, { rejectWithValue }) => {
    try {
      // Gán ID mới
      const newUser = { ...user, id: generateId() };

      // Tạo user
      const res = await axios.post(`${API}/users`, newUser);

      // Tạo các bảng liên quan
      await axios.post(`${API}/carts`, {
        id: generateId(),
        userId: newUser.id,
        items: [],
      });

      await axios.post(`${API}/wishlists`, {
        id: generateId(),
        userId: newUser.id,
        items: [],
      });

      await axios.post(`${API}/orders`, {
        id: generateId(),
        userId: newUser.id,
        status: 'Chưa có đơn hàng',
        total: 0,
        items: [],
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Đăng ký thất bại');
    }
  }
);

// ✅ Thunk: Đăng nhập
export const loginUser = createAsyncThunk<User, { email: string; password: string }>(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/users?email=${email}&password=${password}`);
      if (res.data.length === 0) {
        return rejectWithValue('Email hoặc mật khẩu không đúng');
      }
      return res.data[0]; // Trả về user đầu tiên tìm thấy
    } catch (err) {
      return rejectWithValue('Lỗi đăng nhập');
    }
  }
);

// ✅ Initial State
const initialState: AuthState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

// ✅ Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 📥 fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể tải danh sách người dùng';
      })

      // 📝 registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔐 loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
