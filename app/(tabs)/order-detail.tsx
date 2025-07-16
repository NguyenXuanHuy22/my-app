import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OrderDetailScreen() {
    const { orderId } = useLocalSearchParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!orderId) return;

        const fetchOrder = async () => {
            try {
                const res = await fetch(`http://192.168.1.13:3000/orders/${orderId}`);
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

    const getStepIndex = (status: string) => {
        switch (status) {
            case 'Chờ xử lý':
                return 1;
            case 'Đang giao hàng':
                return 2;
            case 'Đã giao':
                return 3;
            default:
                return 0;
        }
    };

    const renderOrderProgress = (status: string) => {
        const steps = [
            { label: 'Chờ xác nhận', icon: 'time-outline' },
            { label: 'Đang giao hàng', icon: 'bicycle-outline' },
            { label: 'Đã giao', icon: 'checkmark-done-outline' },
        ];
        const currentStep = getStepIndex(status);

        return (
            <View style={styles.progressContainer}>
                {steps.map((step, index) => {
                    const isActive = index < currentStep;
                    return (
                        <React.Fragment key={step.label}>
                            <View style={styles.step}>
                                <Ionicons
                                    name={step.icon as any}
                                    size={20}
                                    color={isActive ? 'green' : '#ccc'}
                                />
                                <Text
                                    style={[
                                        styles.stepLabel,
                                        isActive && { color: 'green', fontWeight: 'bold' },
                                    ]}
                                >
                                    {step.label}
                                </Text>
                            </View>
                            {index < steps.length - 1 && (
                                <View
                                    style={[
                                        styles.line,
                                        { backgroundColor: index < currentStep - 1 ? 'green' : '#ccc' },
                                    ]}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </View>
        );
    };

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
                <TouchableOpacity onPress={() => router.replace('/orders')}>
                    <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>

                <Text style={styles.title}>Thông tin đơn hàng</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* ✅ Thanh trạng thái đơn hàng */}
            {renderOrderProgress(order.status)}

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
                    Thành tiền: {(order.total).toLocaleString()} VND
                </Text>
            </View>

            {/* Nút trạng thái */}
            {order.status === 'Chờ xử lý' ? (
                <TouchableOpacity
                    style={styles.btnBlack}
                    onPress={async () => {
                        try {
                            const res = await fetch(`http://192.168.1.13:3000/orders/${order.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'Đã huỷ' }),
                            });

                            if (!res.ok) throw new Error('Huỷ đơn thất bại');

                            alert('Đã huỷ đơn hàng');
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
                    <Text>{order.status}</Text>
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
    // ✅ Styles cho thanh tiến trình đơn hàng
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16,
        paddingHorizontal: 10,
    },
    step: {
        alignItems: 'center',
        width: 90,
    },
    stepLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
        textAlign: 'center',
    },
    line: {
        height: 2,
        width: 20,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },

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
