import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchProducts, selectProducts } from '../redux/slices/productsSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts) as Product[];
  const loading = useAppSelector(state => state.products.loading);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        router.push({
          pathname: '/ProductDetailScreen',
          params: { id: item.id.toString() },
        })
      }
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price.toLocaleString()} VND</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Text style={styles.title}>Sản phẩm</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Text>🔍</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Đang tải...</Text>
      ) : products.length === 0 ? (
        <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#888',
  },
});

export default HomeScreen;