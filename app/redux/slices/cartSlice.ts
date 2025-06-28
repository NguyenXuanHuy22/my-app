// redux/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
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
            const existing = state.items.find(
                item => item.id === action.payload.id && item.size === action.payload.size
            );
            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        removeFromCart(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) item.quantity = action.payload.quantity;
        },
        clearCart(state) {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
