import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://192.168.1.13:3000/users';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${API_URL}?email=${email}&password=${password}`
      );

      if (response.data.length === 0) {
        return rejectWithValue('Email hoặc mật khẩu không đúng!');
      }

      return response.data[0];
    } catch (error) {
      return rejectWithValue('Lỗi khi đăng nhập!');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, updatedData }: { id: string; updatedData: Partial<User> }) => {
    const response = await axios.patch(`${API_URL}/${id}`, updatedData);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLocal: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      });
  },
});

export const { setUserLocal, logout } = userSlice.actions;
export default userSlice.reducer;
