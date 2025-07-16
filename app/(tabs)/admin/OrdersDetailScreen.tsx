import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
    Image, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params as any;

  const statusSteps = ['Chờ xác nhận', 'Đang giao hàng', 'Đã giao'];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông tin đơn hàng</Text>
      </View>

      {/* Step Progress */}
      <View style={styles.stepContainer}>
        {statusSteps.map((step, index) => (
          <View key={index} style={styles.step}>
            <View style={[
              styles.circle,
              index <= currentStep ? styles.activeCircle : styles.inactiveCircle
            ]} />
            <Text style={styles.stepLabel}>{step}</Text>
            {index < statusSteps.length - 1 && (
              <View style={[
                styles.line,
                index < currentStep ? styles.activeLine : styles.inactiveLine
              ]} />
            )}
          </View>
        ))}
      </View>

      {/* Địa chỉ nhận hàng */}
      <View style={styles.addressBox}>
        <Text style={styles.addressText}>Nguyễn Văn</Text>
        <Text style={styles.addressText}>0987654321</Text>
        <Text style={styles.addressText}>Mỹ Đình, Hà Nội</Text>
      </View>

      {/* Danh sách sản phẩm */}
      {order.items.map((item: any, index: number) => (
        <View key={index} style={styles.productItem}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>BỘ BÓNG ĐÁ KAMITO GIBA 2</Text>
            <Text>x{item.quantity}</Text>
            <Text>Size {item.size}</Text>
            <Text>Màu {item.color}</Text>
            <Text>{item.price.toLocaleString()} đ</Text>
          </View>
        </View>
      ))}

      {/* Tổng tiền */}
      <View style={styles.summary}>
        <Text style={styles.rowText}>Tổng tiền hàng</Text>
        <Text>{order.total.toLocaleString()} đ</Text>
        <Text style={styles.rowText}>Phí vận chuyển</Text>
        <Text>30.000 đ</Text>
        <Text style={styles.rowText}>Thành tiền</Text>
        <Text>{(order.total + 30000).toLocaleString()} đ</Text>
      </View>

      {/* Ngày đặt */}
      <Text style={styles.date}>Ngày đặt hàng: 20-6-2025</Text>

      {/* Nút hành động */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.buttonText}>Hủy đơn</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },

  stepContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  step: { flexDirection: 'row', alignItems: 'center' },
  circle: { width: 12, height: 12, borderRadius: 6 },
  activeCircle: { backgroundColor: 'green' },
  inactiveCircle: { backgroundColor: '#ccc' },
  stepLabel: { fontSize: 12, marginHorizontal: 6 },
  line: { width: 20, height: 1, backgroundColor: '#ccc' },
  activeLine: { backgroundColor: 'green' },
  inactiveLine: { backgroundColor: '#ccc' },

  addressBox: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12,
  },
  addressText: { color: '#888' },

  productItem: { flexDirection: 'row', marginBottom: 10 },
  image: { width: 70, height: 70, borderRadius: 6, marginRight: 10 },
  productInfo: { flex: 1, justifyContent: 'space-between' },
  productName: { fontWeight: 'bold' },

  summary: {
    borderTopWidth: 1, borderColor: '#eee', paddingVertical: 10, marginTop: 10,
  },
  rowText: { marginTop: 5 },

  date: { textAlign: 'right', marginTop: 10, fontStyle: 'italic' },

  buttonContainer: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 20, paddingBottom: 30,
  },
  confirmButton: {
    flex: 1, backgroundColor: '#000', padding: 10,
    marginRight: 5, borderRadius: 6, alignItems: 'center',
  },
  cancelButton: {
    flex: 1, backgroundColor: '#ccc', padding: 10,
    marginLeft: 5, borderRadius: 6, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
