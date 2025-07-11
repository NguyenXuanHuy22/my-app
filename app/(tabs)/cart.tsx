import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { removeFromCart, setCart, updateQuantity } from '../redux/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

export default function CartScreen() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const currentUser = useAppSelector(state => state.auth.user);

    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const cartItems = useAppSelector(state =>
        state.cart.items.filter(item => item.userId === currentUser?.id)
    );

    // ✅ Tính tổng tiền chỉ với sản phẩm được chọn
    const total = cartItems
        .filter(item => selectedItems.includes(item.id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = total > 0 ? 800 : 0;
    const grandTotal = total + shipping;

    // ✅ Load giỏ hàng từ db.json khi user thay đổi
    useEffect(() => {
        const fetchCart = async () => {
            if (currentUser) {
                try {
                    const response = await fetch(`http://192.168.1.13:3000/carts?userId=${currentUser.id}`);
                    const carts = await response.json();
                    const userCart = carts[0] || { items: [] };

                    const normalizedItems = userCart.items.map((item: any) => ({
                        id: item.productId || item.id,
                        name: item.name,
                        image: item.image,
                        price: item.price,
                        quantity: item.quantity,
                        size: item.size,
                        userId: currentUser.id,
                    }));

                    dispatch(setCart(normalizedItems));
                } catch (error) {
                    console.error('Lỗi khi lấy giỏ hàng:', error);
                }
            } else {
                dispatch(setCart([]));
            }
        };
        fetchCart();
    }, [currentUser, dispatch]);

    const handleUpdateQuantity = async (productId: string, newQty: number) => {
        if (!currentUser) return;

        try {
            const response = await fetch(`http://192.168.1.13:3000/carts?userId=${currentUser.id}`);
            const carts = await response.json();
            const userCart = carts[0];

            if (userCart) {
                const updatedItems = userCart.items.map((item: any) =>
                    item.productId === productId ? { ...item, quantity: newQty } : item
                );

                await fetch(`http://192.168.1.13:3000/carts/${userCart.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...userCart, items: updatedItems }),
                });

                dispatch(updateQuantity({ id: productId, quantity: newQty, userId: currentUser.id }));
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật số lượng');
        }
    };


    // ✅ Xử lý tích chọn
    const toggleSelectItem = (productId: string) => {
        setSelectedItems(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    // ✅ Xử lý xóa sản phẩm
    const handleRemoveFromCart = async (productId: string, userId: string) => {
        try {
            const response = await fetch(`http://192.168.1.13:3000/carts?userId=${userId}`);
            const carts = await response.json();
            const userCart = carts[0];

            if (userCart) {
                userCart.items = userCart.items.filter((item: any) => item.productId !== productId);
                await fetch(`http://192.168.1.13:3000/carts/${userCart.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userCart),
                });
                dispatch(removeFromCart({ id: productId, userId }));
                setSelectedItems(prev => prev.filter(id => id !== productId));
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            Alert.alert('Lỗi', 'Không thể xóa sản phẩm khỏi giỏ hàng');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🛒 Giỏ hàng</Text>

            {cartItems.length === 0 ? (
                <Text style={{ fontSize: 16, marginTop: 20 }}>
                    Chưa có sản phẩm nào trong giỏ hàng
                </Text>
            ) : ( 
                <FlatList //test
                    data={cartItems}
                    keyExtractor={(item) => `${item.id}-${item.size}-${item.userId}`} // ✅ Key duy nhất
                    renderItem={({ item }) => (
                        <View style={styles.itemRow}>
                            {/* Nút chọn hình tròn */}
                            <TouchableOpacity onPress={() => toggleSelectItem(item.id)}>
                                <View
                                    style={[
                                        styles.circle,
                                        selectedItems.includes(item.id) && styles.circleSelected,
                                    ]}
                                />
                            </TouchableOpacity>

                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={styles.info}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text>Size: {item.size}</Text>
                                <Text>{item.price.toLocaleString()} VND</Text>
                                <View style={styles.qtyRow}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleUpdateQuantity(item.id, item.quantity - 1)
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        <Text style={styles.qtyBtn}>-</Text>
                                    </TouchableOpacity>
                                    <Text>{item.quantity}</Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleUpdateQuantity(item.id, item.quantity + 1)
                                        }
                                    >
                                        <Text style={styles.qtyBtn}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleRemoveFromCart(item.id, currentUser?.id || '')}
                            >
                                <Ionicons name="trash-outline" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 180 }}
                />


            )}

            {/* Tổng tiền */}
            {cartItems.length > 0 && (
                <View style={[styles.totalBox, { marginBottom: 80 }]}>
                    <Text>Tạm tính: {total.toLocaleString()} VND</Text>
                    <Text style={styles.grandTotal}>Tổng: {grandTotal.toLocaleString()} VND</Text>
                    <TouchableOpacity
                        style={[
                            styles.orderBtn,
                            selectedItems.length === 0 && { backgroundColor: '#ccc' },
                        ]}
                        disabled={selectedItems.length === 0}
                        onPress={() =>
                            router.push({
                                pathname: '/checkout',
                                params: { selected: JSON.stringify(selectedItems) },
                            })
                        }

                    >
                        <Text style={styles.orderText}>Đặt hàng →</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Menu dưới */}
            <View style={styles.bottomMenu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Home')}>
                    <Ionicons name="home-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/cart')}>
                    <Ionicons name="cart" size={24} color="black" />
                    <Text style={styles.menuText}>Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/AccountScreen')}>
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
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#888',
        marginRight: 10,
    },
    circleSelected: {
        backgroundColor: '#000',
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