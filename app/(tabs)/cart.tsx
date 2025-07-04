import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
    const dispatch = useAppDispatch();
    const router = useRouter();

    const currentUser = useAppSelector(state => state.auth.currentUser);

    const cartItems = useAppSelector(state =>
        state.cart.items.filter(item => item.userId === currentUser?.id)
    );

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 800;
    const grandTotal = total + shipping;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🛒 Giỏ hàng</Text>

            {cartItems.length === 0 ? (
                <Text style={{ fontSize: 16, marginTop: 20 }}>
                    Chưa có sản phẩm nào trong giỏ hàng
                </Text>
            ) : (
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
                                            dispatch(
                                                updateQuantity({
                                                    id: item.id,
                                                    quantity: item.quantity - 1,
                                                    userId: currentUser?.id || '',
                                                })
                                            )
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        <Text style={styles.qtyBtn}>-</Text>
                                    </TouchableOpacity>
                                    <Text>{item.quantity}</Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            dispatch(
                                                updateQuantity({
                                                    id: item.id,
                                                    quantity: item.quantity + 1,
                                                    userId: currentUser?.id || '',
                                                })
                                            )
                                        }
                                    >
                                        <Text style={styles.qtyBtn}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() =>
                                    dispatch(
                                        removeFromCart({
                                            id: item.id,
                                            userId: currentUser?.id || '',
                                        })
                                    )
                                }
                            >
                                <Ionicons name="trash-outline" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 180 }} // 👈 tránh bị che
                />
            )}

            {cartItems.length > 0 && (
                <View style={[styles.totalBox, { marginBottom: 80 }]}> {/* 👈 đẩy lên */}
                    <Text>Tổng tiền: {total.toLocaleString()} VND</Text>
                    <Text>Phí vận chuyển: {shipping.toLocaleString()} VND</Text>
                    <Text style={styles.grandTotal}>Tổng: {grandTotal.toLocaleString()} VND</Text>
                    <TouchableOpacity style={styles.orderBtn}>
                        <Text style={styles.orderText}>Đặt hàng →</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.bottomMenu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Home')}>
                    <Ionicons name="home-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/cart')}>
                    <Ionicons name="cart" size={24} color="black" />
                    <Text style={styles.menuText}>Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile')}>
                    <Ionicons name="person-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
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
    qtyRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        marginTop: 4,
    },
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
        fontSize: 20,
    },
    bottomMenu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
    },
    menuItem: {
        alignItems: 'center',
    },
    menuText: {
        fontSize: 12,
        marginTop: 4,
    },
});
