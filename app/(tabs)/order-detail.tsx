import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OrderDetailScreen() {
    const { orderId } = useLocalSearchParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!orderId) return;

        const fetchOrder = async () => {
            try {
                const res = await fetch(`http://192.168.1.11:3000/orders/${orderId}`);
                const data = await res.json();
                setOrder(data);
            } catch (err) {
                console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#000" />;
    }

    if (!order) {
        return <Text style={{ padding: 20 }}>Không tìm thấy đơn hàng.</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/(tabs)/orders')}>
                    <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>

                <Text style={styles.title}>Thông tin đơn hàng</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Trạng thái đơn */}
            <View style={styles.progress}>
                <View style={styles.step}>
                    <View
                        style={[styles.circle, order.status !== 'Chờ xử lý' && styles.activeCircle]}
                    />
                    <Text style={styles.stepText}>Chờ xác nhận</Text>
                </View>
                <View style={styles.step}>
                    <View
                        style={[styles.circle, order.status === 'Đã giao' && styles.activeCircle]}
                    />
                    <Text style={styles.stepText}>Đã giao</Text>
                </View>
            </View>

            {/* Địa chỉ nhận hàng */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
                <View style={styles.addressBox}>
                    <Text style={styles.name}>{order.name || 'Không có tên'}</Text>
                    <Text style={styles.phone}>{order.phone || 'Không có số điện thoại'}</Text>
                    <Text style={styles.address}>{order.address || 'Không có địa chỉ'}</Text>
                </View>
            </View>

            {/* Danh sách sản phẩm */}
            {order.items.map((item: any, index: number) => (
                <View key={index} style={styles.productRow}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        <Text>Size: {item.size}</Text>
                        <Text>Số lượng: {item.quantity}</Text>
                        <Text>Màu: {item.color}</Text>
                        <Text>₫{item.price.toLocaleString()}</Text>
                    </View>
                </View>
            ))}

            {/* Thông tin đơn */}
            <View style={styles.section}>
                <Text>Ngày đặt hàng: {order.date}</Text>
                <Text>Tổng tiền hàng: {order.total.toLocaleString()} VND</Text>
                <Text style={{ fontWeight: 'bold' }}>
                    Thành tiền: {(order.total + 30000).toLocaleString()} VND
                </Text>
            </View>

            {/* Nút trạng thái */}
            {order.status === 'Chờ xử lý' ? (
                <TouchableOpacity
                    style={styles.btnBlack}
                    onPress={async () => {
                        try {
                            const res = await fetch(`http://192.168.1.11:3000/orders/${order.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'Đã huỷ' }),
                            });

                            if (!res.ok) throw new Error('Huỷ đơn thất bại');

                            alert('Đã huỷ đơn hàng');
                            // 👉 Quay về danh sách đơn hàng sau khi huỷ
                            router.replace('/(tabs)/orders');
                        } catch (err) {
                            console.error('Lỗi huỷ đơn:', err);
                            alert('Lỗi khi huỷ đơn hàng');
                        }
                    }}
                >
                    <Text style={{ color: '#fff' }}>Huỷ đơn</Text>
                </TouchableOpacity>

            ) : (
                <TouchableOpacity style={styles.btnGray}>
                    <Text>Đang giao</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: { fontSize: 18, fontWeight: 'bold' },
    progress: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 },
    step: { alignItems: 'center' },
    circle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#ccc',
        marginBottom: 6,
    },
    activeCircle: { backgroundColor: 'green' },
    stepText: { fontSize: 12 },
    section: { paddingHorizontal: 16, marginBottom: 12 },
    sectionTitle: { fontWeight: 'bold', marginBottom: 6 },
    addressBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    name: { fontWeight: 'bold', fontSize: 16 },
    phone: { color: '#666', marginTop: 2 },
    address: { color: '#666', marginTop: 2 },
    productRow: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    image: { width: 60, height: 60, borderRadius: 8 },
    btnBlack: {
        margin: 16,
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnGray: {
        margin: 16,
        backgroundColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
});
