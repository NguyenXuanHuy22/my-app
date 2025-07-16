import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppSelector } from '../redux/store';

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
  const [selectedTab, setSelectedTab] = useState<'pending' | 'shipping' | 'delivered'>('pending');
  const router = useRouter();

  // ✅ Lọc đơn hàng theo tab
  const filteredOrders = orders.filter(order =>
    order.status !== 'Đã huỷ' && (
      selectedTab === 'pending'
        ? order.status === 'Chờ xử lý'
        : selectedTab === 'shipping'
          ? order.status === 'Đang giao hàng'
          : order.status === 'Đã giao'
    )
  );


  useFocusEffect(
    useCallback(() => {
      if (!currentUser) return;

      const fetchOrders = async () => {
        try {
          const res = await fetch(`http://192.168.1.13:3000/orders?userId=${currentUser.id}`);
          const data = await res.json();
          console.log('Dữ liệu từ server:', data);
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
      const res = await fetch(`http://192.168.1.13:3000/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Đã huỷ' }),
      });

      if (!res.ok) throw new Error('Không thể huỷ đơn hàng');

      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: 'Đã huỷ' } : order
      ));
    } catch (error) {
      console.error('Lỗi khi huỷ đơn:', error);
      alert('Không thể huỷ đơn hàng');
    }
  };

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
        {item.items.length > 0 && item.status === 'Chờ xử lý' && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => handleCancelOrder(item.id)}
          >
            <Text style={{ color: '#fff', fontSize: 13 }}>Huỷ đơn</Text>
          </TouchableOpacity>
        )}

      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/AccountScreen')}>
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
          <Text style={[styles.tabText, selectedTab === 'pending' && styles.activeText]}>
            Chờ xử lý
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedTab('shipping')}
          style={[styles.tabBtn, selectedTab === 'shipping' && styles.activeTab]}
        >
          <Text style={[styles.tabText, selectedTab === 'shipping' && styles.activeText]}>
            Đang giao
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedTab('delivered')}
          style={[styles.tabBtn, selectedTab === 'delivered' && styles.activeTab]}
        >
          <Text style={[styles.tabText, selectedTab === 'delivered' && styles.activeText]}>
            Đã giao
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {filteredOrders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: '#999' }}>
            Không có đơn hàng {
              selectedTab === 'pending' ? 'chờ xử lý' :
                selectedTab === 'shipping' ? 'đang giao' :
                  'đã giao'
            }.
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
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tabBtn: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
  },
  activeTab: {
    borderColor: '#000',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#000',
  },
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
  cancelBtn: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-end',
    maxWidth: 100,
  },
});
