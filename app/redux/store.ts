import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authReducer from './slices/authSlice';
import bannerReducer from './slices/bannerSlice';
import cartReducer from './slices/cartSlice';
import chatReducer from './slices/chatSlice';
import orderReducer from './slices/ordersSlice';
import productsReducer from './slices/productsSlice';
import userReducer from './slices/userSlice';



//  1. Cấu hình persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart'], // Chỉ lưu cart
};

//  2. Gộp reducer
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productsReducer,
  banners: bannerReducer,
  chat: chatReducer,
  user: userReducer,
  orders: orderReducer,
});

//  3. Áp dụng persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

//  4. Khởi tạo store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        //  Bỏ qua các action gây lỗi serialize khi dùng redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

//  5. Tạo persistor
export const persistor = persistStore(store);

// 6. Kiểu & hooks
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;