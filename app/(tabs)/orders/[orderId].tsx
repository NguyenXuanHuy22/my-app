import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/ordersSlice';

const progressSteps = [
  { label: 'Chờ xác nhận', icon: 'time-outline' },
  { label: 'Đang giao hàng', icon: 'bicycle-outline' },
  { label: 'Đã giao', icon: 'checkmark-done-outline' },
];

const OrderProgress = ({ status }: { status: string }) => {
  const currentStep = ['Chờ xử lý', 'Đã xác nhận đơn hàng', 'Đang giao hàng', 'Đã giao'].indexOf(status);

  return (
    <View style={styles.progressContainer}>
      {progressSteps.map((step, index) => {
        const isActive = index <= currentStep - 1;

        return (
          <React.Fragment key={step.label}>
            <View style={styles.step}>
              <View
                style={[
                  styles.circle,
                  { backgroundColor: isActive ? '#4caf50' : '#ccc' },
                ]}
              >
                <Ionicons
                  name={step.icon as any}
                  size={14}
                  color={isActive ? '#fff' : '#666'}
                />
              </View>
              <Text style={styles.stepLabel}>{step.label}</Text>
            </View>
            {index < progressSteps.length - 1 && (
              <View
                style={[
                  styles.line,
                  { backgroundColor: index < currentStep - 1 ? '#4caf50' : '#ccc' },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const OrderDetailScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const dispatch = useAppDispatch();

  const { orders, loading } = useAppSelector((state) => state.orders);
  const order = orders.find((o) => o.id === orderId);

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchAllOrders());
    }
  }, [dispatch]);

  if (loading || !order) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {loading ? 'Đang tải dữ liệu đơn hàng...' : 'Không tìm thấy đơn hàng.'}
        </Text>
      </View>
    );
  }

  const handleNextStep = () => {
    let nextStatus = '';
    switch (order.status) {
      case 'Chờ xử lý':
        nextStatus = 'Đã xác nhận đơn hàng';
        break;
      case 'Đã xác nhận đơn hàng':
        nextStatus = 'Đang giao hàng';
        break;
      case 'Đang giao hàng':
        nextStatus = 'Đã giao';
        break;
      default:
        return;
    }

    dispatch(updateOrderStatus({ orderId: order.id, newStatus: nextStatus }));
  };

  const handleCancelOrder = () => {
    dispatch(updateOrderStatus({ orderId: order.id, newStatus: 'Đã huỷ' }));
  };

  const getNextButtonLabel = () => {
    switch (order.status) {
      case 'Chờ xử lý':
        return 'Xác nhận đơn hàng';
      case 'Đã xác nhận đơn hàng':
        return 'Đang giao hàng';
      case 'Đang giao hàng':
        return 'Đã giao';
      default:
        return '';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/admin/manage-orders')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông tin đơn hàng</Text>
      </View>

      <View style={styles.addressBox}>
        <Text style={styles.addressText}>{order.name}</Text>
        <Text style={styles.addressText}>{order.phone}</Text>
        <Text style={styles.addressText}>{order.address}</Text>
      </View>

      {/* Thanh tiến trình trạng thái */}
      <OrderProgress status={order.status} />

      {order.items.map((item, index) => (
        <View key={item.orderDetailId || index.toString()} style={styles.productItem}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>x{item.quantity}</Text>
            <Text>Size {item.size}</Text>
            <Text>Màu {item.color}</Text>
            <Text>{item.price.toLocaleString()} đ</Text>
          </View>
        </View>
      ))}

      <View style={styles.summary}>
        <Text style={styles.rowText}>Tổng tiền hàng</Text>
        <Text>{order.total.toLocaleString()} đ</Text>
        <Text style={styles.rowText}>Thành tiền</Text>
        <Text>{(order.total).toLocaleString()} đ</Text>
      </View>

      <Text style={styles.date}>
        Ngày đặt hàng: {new Date(order.date).toLocaleDateString('vi-VN')}
      </Text>

      {order.status !== 'Đã giao' && order.status !== 'Đã huỷ' && (
        <View style={styles.buttonContainer}>
          {getNextButtonLabel() !== '' && (
            <TouchableOpacity style={styles.confirmButton} onPress={handleNextStep}>
              <Text style={styles.buttonText}>{getNextButtonLabel()}</Text>
            </TouchableOpacity>
          )}
          {order.status === 'Chờ xử lý' || order.status === 'Đã xác nhận đơn hàng' ? (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
              <Text style={styles.buttonText}>Huỷ đơn</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  addressBox: {
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 16,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 4,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summary: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
  },
  rowText: {
    fontWeight: '600',
    marginBottom: 6,
  },
  date: {
    fontStyle: 'italic',
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    minWidth: 120,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // Thanh trạng thái
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  step: {
    alignItems: 'center',
    width: 90,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  line: {
    height: 2,
    width: 20,
    backgroundColor: '#ccc',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});
