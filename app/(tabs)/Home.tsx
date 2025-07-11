import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchBanners, selectBanners } from '../redux/slices/bannerSlice';
import { fetchProducts, selectProducts } from '../redux/slices/productsSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}
interface Banner {
  id: string;
  image: string;
}

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const products = useAppSelector(selectProducts) as Product[];
  const loading = useAppSelector(state => state.products.loading);
  const banners = useAppSelector(selectBanners) as Banner[];

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchBanners());
  }, [dispatch]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredProducts(
      !query
        ? products
        : products.filter(p => p.name.toLowerCase().includes(query))
    );
  }, [searchQuery, products]);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBanner(prev => {
        const nextIndex = (prev + 1) % banners.length;
        scrollRef.current?.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  const renderItem = ({ item, index }: { item: Product; index: number }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price.toLocaleString()} VND</Text>
    </TouchableOpacity>
  );

  if (!products || !banners) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        renderItem={renderItem}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 90 }}
        ListHeaderComponent={
          <View>
            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
              <TextInput
                placeholder="Tìm sản phẩm..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Banner Carousel */}
            <View style={styles.bannerWrapper}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                ref={scrollRef}
                onScroll={(event) => {
                  const scrollX = event.nativeEvent.contentOffset.x;
                  const index = Math.round(scrollX / screenWidth);
                  setCurrentBanner(index);
                }}
                scrollEventThrottle={16}
              >
                {banners.map((banner, index) => (
                  <Image
                    key={`${banner.id}-${index}`}
                    source={{ uri: banner.image }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {/* Dots */}
              <View style={styles.dotsContainer}>
                {banners.map((_, index) => (
                  <View
                    key={`dot-${index}`}
                    style={[
                      styles.dot,
                      currentBanner === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>

            {loading && (
              <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
            )}
            {!loading && filteredProducts.length === 0 && (
              <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
            )}
          </View>
        }
      />

      {/* Bottom Menu */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Home')}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/cart')}>
          <Ionicons name="cart-outline" size={24} color="black" />
          <Text style={styles.menuText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/AccountScreen')}>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.menuText}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bannerWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerImage: {
    width: screenWidth - 32,
    height: 180,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#333',
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
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 16,
    color: '#888',
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  menuItem: {
    alignItems: 'center',
  },
  menuText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default HomeScreen;