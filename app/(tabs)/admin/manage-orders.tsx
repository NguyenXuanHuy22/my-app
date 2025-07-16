import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAllOrders } from '../../redux/slices/ordersSlice';

interface OrderDetail {
  orderDetailId: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  subtotal: number;
  date: string;
}

interface Order {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  date: string;
  items: OrderDetail[];
}

const OrderManagementScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const filteredOrders: Order[] = Array.isArray(orders)
    ? orders.filter((order) =>
        order.items?.some((item) =>
          item?.productId?.toLowerCase().includes(searchText.toLowerCase())
        )
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const renderOrder = ({ item }: { item: Order }) => {
    const firstItem = item.items?.[0];
    if (!firstItem) return null;

    return (
      <TouchableOpacity
        onPress={() =>
         router.push(`/orders/${item.id}`)
        }
        style={styles.card}
        activeOpacity={0.8}
      >
        <View style={styles.itemBlock}>
          <Image
            source={{ uri: firstItem.image || 'https://via.placeholder.com/70' }}
            style={styles.image}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Người nhận: {item.name}</Text>
            <Text style={styles.subText}>SĐT: {item.phone}</Text>
            <Text style={styles.subText}>Địa chỉ: {item.address}</Text>
            <Text style={styles.subText}>Số sản phẩm: {item.items.length}</Text>
            <Text style={styles.subText}>
              Ngày đặt: {new Date(item.date).toLocaleDateString()}
            </Text>
            <Text style={styles.price}>
              Tổng tiền: ₫ {item.total.toLocaleString()}
            </Text>
            <Text style={[styles.statusText, getStatusStyle(item.status)]}>
              Trạng thái: {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Chờ xử lý':
        return { backgroundColor: '#ffeeba', color: '#856404' };
      case 'Đã xác nhận đơn hàng':
        return { backgroundColor: '#cce5ff', color: '#004085' };
      case 'Đang giao hàng':
        return { backgroundColor: '#d4edda', color: '#155724' };
      case 'Đã giao':
        return { backgroundColor: '#d1ecf1', color: '#0c5460' };
      case 'Đã huỷ':
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      default:
        return { backgroundColor: '#eee', color: '#333' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/AccountScreen')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Quản lý đơn hàng</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Tìm kiếm theo mã SP"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Đang tải...</Text>
      ) : filteredOrders.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Không tìm thấy đơn hàng.</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </View>
  );
};

export default OrderManagementScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 12 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40 },
  card: {
    backgroundColor: '#fefefe',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemBlock: { flexDirection: 'row' },
  image: { width: 70, height: 70, marginRight: 12, borderRadius: 8 },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  subText: { fontSize: 13, color: '#555' },
  price: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  statusText: {
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
    overflow: 'hidden',
  },
});
