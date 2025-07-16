import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { fetchProducts, selectProducts } from '../../redux/slices/productsSlice';
import { RootState, useAppDispatch } from '../../redux/store';

const ManageProducts = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const products = useSelector(selectProducts);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');
  const [image, setImage] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.replace('./unauthorized');
    } else {
      dispatch(fetchProducts());
    }
  }, [user]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setImage('');
    setDescription('');
    setSizes([]);
    setNewSize('');
    setEditingProductId(null);
  };

  const pickImage = async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) {
      Alert.alert('Permission required', 'Cho phép truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter(s => s !== sizeToRemove));
  };

  const handleSubmit = async () => {
    if (!name || !price || !image || !description || sizes.length === 0) {
      Alert.alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const newProduct = {
      id: editingProductId || Date.now().toString(),
      name,
      price: Number(price),
      image,
      description,
      category: 'Áo thể thao',
      sizes,
    };

    const url = editingProductId
      ? `http://192.168.1.11:3000/products/${editingProductId}`
      : 'http://192.168.1.11:3000/products';

    const method = editingProductId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });

    dispatch(fetchProducts());
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (product: any) => {
    setShowForm(true);
    setEditingProductId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setImage(product.image);
    setDescription(product.description);
    setSizes(product.sizes);
  };

  const handleDeleteProduct = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa sản phẩm này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        onPress: async () => {
          await fetch(`http://192.168.1.11:3000/products/${id}`, {
            method: 'DELETE',
          });
          dispatch(fetchProducts());
        },
      },
    ]);
  };


  const renderProductItem = ({ item }: any) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} VND</Text>
      <Text style={styles.sizeText}>Sizes: {item.sizes.join(', ')}</Text>

      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <AntDesign name="edit" size={18} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
          <AntDesign name="delete" size={20} color="red" />
        </TouchableOpacity>

      </View>
    </View>
  );

  const renderForm = () => (
    <Modal visible={showForm} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <TouchableOpacity onPress={() => setShowForm(false)} style={{ marginBottom: 10 }}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>
            {editingProductId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </Text>

          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={{ height: 150, borderRadius: 8 }} />
            ) : (
              <View style={{ backgroundColor: '#ddd', height: 150, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Chọn ảnh</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput value={name} onChangeText={setName} placeholder="Tên sản phẩm" style={styles.input} />
          <TextInput value={price} onChangeText={setPrice} placeholder="Giá" keyboardType="numeric" style={styles.input} />
          <TextInput value={description} onChangeText={setDescription} placeholder="Mô tả" multiline style={styles.input} />

          <View style={styles.sizeRow}>
            <TextInput
              value={newSize}
              onChangeText={setNewSize}
              placeholder="Thêm size"
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity onPress={handleAddSize} style={styles.addButton}>
              <Text style={{ color: '#fff' }}>Thêm</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sizeList}>
            {sizes.map((s, idx) => (
              <TouchableOpacity key={idx} onPress={() => handleRemoveSize(s)} style={styles.sizeBadge}>
                <Text>{s} ❌</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={{ color: '#fff' }}>{editingProductId ? 'Cập nhật' : 'Thêm sản phẩm'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        numColumns={2}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)/AccountScreen')}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.sectionTitle}> Quản lý sản phẩm</Text>
          </View>
        }
        columnWrapperStyle={styles.rowWrapper}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setShowForm(true);
        }}
      >
        <AntDesign name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {renderForm()}
    </View>
  );


};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#000',
    paddingHorizontal: 14,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  sizeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 10,
  },
  sizeBadge: {
    backgroundColor: '#eee',
    padding: 6,
    borderRadius: 6,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 12,
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: '48%',
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 6,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
  },
  productPrice: {
    color: '#555',
    fontSize: 13,
  },
  sizeText: {
    fontSize: 12,
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rowWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#000',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },


});

export default ManageProducts;
