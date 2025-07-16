import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
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
  total: number;
  status: string;
  items: OrderDetail[];
}

const OrderManagementScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector(state => state.orders);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, []);

  const filteredOrders: Order[] = orders.filter(order =>
    order.items.some(item =>
      item?.productId?.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      {item.items.map((detail: OrderDetail) => (
        <View key={detail.orderDetailId} style={styles.itemBlock}>
          <Image source={{ uri: detail.image }} style={styles.image} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Mã SP: {detail.productId}</Text>
            <Text style={styles.subText}>Size: {detail.size}</Text>
            <Text style={styles.subText}>Màu: {detail.color}</Text>
            <Text style={styles.subText}>Số lượng: {detail.quantity}</Text>
            <Text style={styles.subText}>Ngày: {detail.date}</Text>
            <Text style={styles.price}>₫ {detail.price.toLocaleString()}</Text>
            <Text style={styles.statusText}>Trạng thái: {item.status}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/AccountScreen')}>
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
      ) : (
        <FlatList
        
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </View>
  );
};

export default OrderManagementScreen;



const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 12 },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  searchInput: { flex: 1, height: 40 },
  searchIcon: { marginRight: 8 },
  card: {
    backgroundColor: '#fdfdfd',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  itemBlock: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  image: { width: 70, height: 70, marginRight: 10, borderRadius: 5 },
  name: { fontWeight: 'bold', fontSize: 16 },
  subText: { color: '#555' },
  price: { fontWeight: 'bold', marginTop: 4 },
  statusText: {
    marginTop: 6,
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 12,
  },
});
