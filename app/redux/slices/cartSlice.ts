// redux/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    userId: string; // ✅ Thêm userId để phân biệt
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<CartItem>) {
            const { id, size, userId } = action.payload;
            const existing = state.items.find(
                item => item.id === id && item.size === size && item.userId === userId
            );
            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        removeFromCart(state, action: PayloadAction<{ id: string; userId: string }>) {
            state.items = state.items.filter(
                item => !(item.id === action.payload.id && item.userId === action.payload.userId)
            );
        },
        updateQuantity(state, action: PayloadAction<{ id: string; quantity: number; userId: string }>) {
            const item = state.items.find(
                item => item.id === action.payload.id && item.userId === action.payload.userId
            );
            if (item) item.quantity = action.payload.quantity;
        },
        clearCart(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item.userId !== action.payload);
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
