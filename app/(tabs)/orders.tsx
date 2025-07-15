import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../redux/store';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


// ✅ Kiểu dữ liệu
interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  subtotal: number;
}

interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  date: string;
  items: OrderItem[];
}

export default function OrdersScreen() {
  const currentUser = useAppSelector(state => state.auth.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'delivered'>('pending');
  const router = useRouter();

  // ✅ Thêm dòng này
  const filteredOrders = orders.filter(order =>
    order.status !== 'Đã huỷ' && (
      selectedTab === 'pending'
        ? order.status === 'Chờ xử lý'
        : order.status === 'Đã giao'
    )
  );

  useFocusEffect(
    useCallback(() => {
      if (!currentUser) return;

      const fetchOrders = async () => {
        try {
          const res = await fetch(`http://192.168.1.11:3000/orders?userId=${currentUser.id}`);
          const data = await res.json();
          setOrders(data);
        } catch (err) {
          console.error('Lỗi khi tải đơn hàng:', err);
        }
      };

      fetchOrders();
    }, [currentUser])
  );

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`http://192.168.1.11:3000/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Đã huỷ' }),
      });

      if (!res.ok) throw new Error('Không thể huỷ đơn hàng');

      // Cập nhật lại danh sách
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: 'Đã huỷ' } : order
      ));
    } catch (error) {
      console.error('Lỗi khi huỷ đơn:', error);
      alert('Không thể huỷ đơn hàng');
    }
  };

  // ✅ Sửa kiểu dữ liệu cho renderItem
  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/order-detail', params: { orderId: item.id } })}
      style={styles.card}
    >
      {item.items.length === 0 ? (
        <Text style={{ color: '#999', fontStyle: 'italic' }}>Đơn hàng trống</Text>
      ) : (
        item.items.map((product, index) => (
          <View key={index} style={styles.productRow}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text>Size: {product.size}</Text>
              <Text>Số lượng: {product.quantity}</Text>
              <Text style={{ fontWeight: 'bold' }}>
                ₫{product.price.toLocaleString()}
              </Text>
            </View>
          </View>
        ))
      )}

      <View style={styles.footer}>
        <Text style={{ fontWeight: 'bold' }}>Tổng: ₫{item.total.toLocaleString()}</Text>
        {item.items.length > 0 && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              if (item.status === 'Đã giao') {
                alert('Chức năng đánh giá chưa hỗ trợ.');
              } else {
                handleCancelOrder(item.id);
              }
            }}
          >
            <Text style={{ color: '#fff', fontSize: 13 }}>
              {item.status === 'Đã giao' ? 'Đánh giá' : 'Huỷ đơn'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/Home')}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setSelectedTab('pending')}
          style={[styles.tabBtn, selectedTab === 'pending' && styles.activeTab]}
        >
          <Text style={selectedTab === 'pending' && styles.activeText}>
            Chờ xử lý
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab('delivered')}
          style={[styles.tabBtn, selectedTab === 'delivered' && styles.activeTab]}
        >
          <Text style={selectedTab === 'delivered' && styles.activeText}>
            Đã giao
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {filteredOrders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: '#999' }}>
            Không có đơn hàng {selectedTab === 'pending' ? 'chờ xử lý' : 'đã giao'}.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: { fontWeight: 'bold', fontSize: 18 },
  tabs: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: { borderColor: '#000' },
  activeText: { fontWeight: 'bold', color: '#000' },
  empty: { alignItems: 'center', marginTop: 50 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
  },
  productRow: { flexDirection: 'row', marginBottom: 10 },
  image: { width: 60, height: 60, borderRadius: 8 },
  productName: { fontWeight: 'bold', fontSize: 14 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-end', // ✅ Căn sang phải
    maxWidth: 100,         // ✅ Không cho quá dài
  },
});
