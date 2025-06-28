import { Ionicons } from '@expo/vector-icons';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    removeFromCart,
    updateQuantity,
} from '../redux/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

export default function CartScreen() {
    const cartItems = useAppSelector(state => state.cart.items);
    const dispatch = useAppDispatch();

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 800;
    const grandTotal = total + shipping;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🛒 Giỏ hàng</Text>
            <FlatList
                data={cartItems}
                keyExtractor={(item, index) => item.id + index}
                renderItem={({ item }) => (
                    <View style={styles.itemRow}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text>Size: {item.size}</Text>
                            <Text>{item.price.toLocaleString()} VND</Text>
                            <View style={styles.qtyRow}>
                                <TouchableOpacity
                                    onPress={() =>
                                        dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                                    }
                                    disabled={item.quantity <= 1}
                                >
                                    <Text style={styles.qtyBtn}>-</Text>
                                </TouchableOpacity>
                                <Text>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                                    }
                                >
                                    <Text style={styles.qtyBtn}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
                            <Ionicons name="trash-outline" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View style={styles.totalBox}>
                <Text>Tổng tiền: {total.toLocaleString()} VND</Text>
                <Text>Phí vận chuyển: {shipping.toLocaleString()} VND</Text>
                <Text style={styles.grandTotal}>Tổng: {grandTotal.toLocaleString()} VND</Text>
                <TouchableOpacity style={styles.orderBtn}>
                    <Text style={styles.orderText}>Đặt hàng →</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    itemRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    image: { width: 60, height: 60, borderRadius: 8 },
    info: { flex: 1 },
    name: { fontWeight: 'bold' },
    qtyRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 },
    qtyBtn: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    totalBox: {
        borderTopWidth: 1,
        borderColor: '#eee',
        paddingTop: 16,
    },
    grandTotal: { fontWeight: 'bold', fontSize: 16, marginVertical: 8 },
    orderBtn: {
        backgroundColor: '#000',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    orderText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
//quang tèo22222
