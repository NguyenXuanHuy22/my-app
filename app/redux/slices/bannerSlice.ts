import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Banner {
  id: string;
  image: string;
}

interface BannerState {
  banners: Banner[];
  loading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
};

// ✅ Fetch banners
export const fetchBanners = createAsyncThunk('banners/fetchBanners', async () => {
  const response = await axios.get('http://192.168.1.11:3000/banner');
  return response.data;
});

// ✅ Add banner
export const addBanner = createAsyncThunk(
  'banners/addBanner',
  async (banner: { image: string }) => {
    const response = await axios.post('http://192.168.1.11:3000/banner', banner);
    return response.data;
  }
);

// ✅ Delete banner
export const deleteBanner = createAsyncThunk(
  'banners/deleteBanner',
  async (id: string) => {
    await axios.delete(`http://192.168.1.11:3000/banner/${id}`);
    return id;
  }
);

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action: PayloadAction<Banner[]>) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi fetch';
      })

      // Add
      .addCase(addBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBanner.fulfilled, (state, action: PayloadAction<Banner>) => {
        state.loading = false;
        state.banners.push(action.payload);
      })
      .addCase(addBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi thêm banner';
      })

      // Delete
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBanner.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.banners = state.banners.filter((banner) => banner.id !== action.payload);
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi xóa banner';
      });
  },
});

export default bannerSlice.reducer;

// ✅ Selector
export const selectBanners = (state: any) => state.banners.banners;
