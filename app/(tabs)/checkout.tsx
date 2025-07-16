import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import uuid from 'react-native-uuid';
import { removeItemsByIds } from '../redux/slices/cartSlice'; // thêm dòng này
import { useAppDispatch, useAppSelector } from '../redux/store';


export default function CheckoutScreen() {
    const router = useRouter();
    const { selected } = useLocalSearchParams();
    const selectedIds = typeof selected === 'string' ? JSON.parse(selected) : [];
    const [address, setAddress] = useState('');
    const currentUser = useAppSelector(state => state.auth.user);
    const cartItems = useAppSelector(state =>
        state.cart.items.filter(item => {
            const key = `${item.id}_${item.size}`;
            return item.userId === currentUser?.id && selectedIds.includes(key);
        })
    );
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 80;
    const grandTotal = total + shipping;

    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const dispatch = useAppDispatch(); // Thêm vào component

    // Khi màn hình được focus lại (quay lại từ AddressScreen)
    useFocusEffect(
        useCallback(() => {
            const fetchUserInfo = async () => {
                if (!currentUser) return;

                try {
                    const response = await fetch(`http://192.168.1.13:3000/users/${currentUser.id}`);
                    const userData = await response.json();
                    setAddress(userData.address || '');
                    setName(userData.name || '');
                    setPhone(userData.phone || '');
                } catch (error) {
                    console.error('Lỗi khi lấy địa chỉ:', error);
                    setAddress('');
                }
            };

            fetchUserInfo();
        }, [currentUser])
    );


    const handlePlaceOrder = async () => {
        if (!currentUser) return;

        const orderId = (uuid.v4() as string).slice(0, 8);

        const newOrder = {
            id: orderId,
            userId: currentUser.id,
            name,
            phone,
            address,
            status: 'Chờ xử lý',
            total: grandTotal,
            date: new Date().toISOString(),
            items: cartItems.map(item => ({
                orderDetailId: (uuid.v4() as string).slice(0, 8),
                productId: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: 'Trắng',
                subtotal: item.price * item.quantity,
            })),
        };

        try {
            const response = await fetch('http://192.168.1.13:3000/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),
            });

            if (!response.ok) throw new Error('Không thể lưu đơn hàng');

            // ✅ Xoá chỉ những sản phẩm đã chọn
            dispatch(removeItemsByIds({ userId: currentUser.id, keysToRemove: selectedIds }));
            setModalVisible(true);
        } catch (err) {
            console.error(err);
            alert('Lỗi: Không thể đặt hàng');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/(tabs)/cart')}>
                    <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>

                <Text style={styles.title}>Đặt hàng</Text>
                <View style={{ width: 24 }} />
            </View>

            {cartItems.map(item => (
                <View key={item.id} style={styles.productCard}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text>Size {item.size}</Text>
                        <Text>Màu: Trắng</Text>
                        <Text>Số lượng: {item.quantity}</Text>
                    </View>
                </View>
            ))}

            {/* Địa chỉ */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Địa chỉ</Text>
                <View style={styles.row}>
                    <Ionicons name="location-outline" size={20} />
                    <View style={{ marginLeft: 8 }}>
                        <Text>Nhà</Text>
                        <Text>{address || 'Chưa có địa chỉ'}</Text>
                    </View>
                    <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => router.push('./AddressScreen')}>
                        <Text style={styles.addText}>Thêm</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Phương thức thanh toán */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                <View style={styles.paymentRow}>
                    <Text style={styles.method}>Thanh Toán khi nhận hàng</Text>
                </View>

            </View>

            {/* Tổng tiền */}
            <View style={styles.section}>
                <View style={styles.rowBetween}>
                    <Text style={styles.grayText}>Tổng tiền</Text>
                    <Text style={styles.blackText}>{total.toLocaleString('vi-VN')} VND</Text>
                </View>
                <View style={styles.rowBetween}>
                    <Text style={styles.totalLabel}>Tổng</Text>
                    <Text style={styles.totalValue}>
                        {grandTotal.toLocaleString('vi-VN')} VND
                    </Text>
                </View>

            </View>

            {/* Nút đặt hàng */}
            <TouchableOpacity style={styles.orderBtn} onPress={handlePlaceOrder}>
                <Text style={styles.orderText}>Đặt hàng</Text>
            </TouchableOpacity>

            {/* Modal đặt hàng thành công */}
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Ionicons name="checkmark-circle-outline" size={60} color="green" />
                        <Text style={styles.modalTitle}>Congratulations!</Text>
                        <Text>Your order has been placed.</Text>
                        <TouchableOpacity
                            style={styles.trackBtn}
                            onPress={() => {
                                setModalVisible(false);
                                router.replace('/(tabs)/orders');
                            }}
                        >
                            <Text style={styles.trackText}>Track Your Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 18, fontWeight: 'bold' },
    productCard: {
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 10,
    },
    image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
    name: { fontWeight: 'bold' },
    section: { marginTop: 24 },
    sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
    row: { flexDirection: 'row', alignItems: 'center' },
    addText: { color: '#7d4cff', fontWeight: 'bold' },
    paymentRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
    method: {
        backgroundColor: '#eee',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 6,
        fontWeight: '500',
    },
    cardInfo: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 10,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    grayText: { color: '#888' },
    blackText: { color: '#000' },
    totalLabel: { fontWeight: 'bold', fontSize: 16 },
    totalValue: { fontWeight: 'bold', fontSize: 16 },
    orderBtn: {
        backgroundColor: '#000',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 40,
    },
    orderText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 16,
        alignItems: 'center',
        width: '80%',
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
    trackBtn: {
        marginTop: 20,
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    trackText: { color: '#fff', fontWeight: 'bold' },
});
