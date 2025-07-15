import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    userId: string;
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

        removeFromCart(state, action: PayloadAction<{ id: string; size: string; userId: string }>) {
            state.items = state.items.filter(
                item =>
                    !(item.id === action.payload.id &&
                        item.size === action.payload.size &&
                        item.userId === action.payload.userId)
            );
        },

        updateQuantity(state, action: PayloadAction<{ id: string; size: string; quantity: number; userId: string }>) {
            const item = state.items.find(
                item => item.id === action.payload.id &&
                    item.size === action.payload.size &&
                    item.userId === action.payload.userId
            );
            if (item) item.quantity = action.payload.quantity;
        },

        clearCart(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item.userId !== action.payload);
        },

        setCart(state, action: PayloadAction<CartItem[]>) {
            state.items = action.payload;
        },

        // ✅ Mới: xóa nhiều sản phẩm theo selectedIds (dùng cho đặt hàng)
        removeItemsByIds(state, action: PayloadAction<{
            userId: string;
            keysToRemove: string[]; // dạng ["id_size"]
        }>) {
            const { userId, keysToRemove } = action.payload;
            state.items = state.items.filter(item =>
                item.userId !== userId ||
                !keysToRemove.includes(`${item.id}_${item.size}`)
            );
        },
    },
});

// ✅ Đừng quên export reducer mới
export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCart,
    removeItemsByIds, // <-- thêm ở đây
} = cartSlice.actions;

export default cartSlice.reducer;
