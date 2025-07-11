import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { addBanner, deleteBanner, fetchBanners, selectBanners } from '../../redux/slices/bannerSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';

const ManageBannersScreen = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const banners = useAppSelector(selectBanners);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const slideAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const togglePanel = () => {
    setShowAddPanel(!showAddPanel);
    Animated.timing(slideAnim, {
      toValue: showAddPanel ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteBanner(id));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = () => {
    if (!imageUri) return Alert.alert('Vui lòng chọn ảnh');
    dispatch(addBanner({ image: imageUri }));
    setImageUri(null);
    togglePanel(); // Ẩn panel sau khi thêm
  };

  const panelHeight = Dimensions.get('window').height * 0.35;
  const panelTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [panelHeight, 0],
  });

  const renderItem = ({ item }: any) => (
    <View style={styles.bannerItem}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/AccountScreen')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Quản lý Banner</Text>
      </View>

      {/* Banner List */}
      <FlatList
        data={banners}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Nút + tròn */}
      <TouchableOpacity style={styles.addButton} onPress={togglePanel}>
        <AntDesign name="pluscircle" size={48} color="#007AFF" />
      </TouchableOpacity>

      {/* Add Banner Panel */}
      <Animated.View
        style={[
          styles.addPanel,
          {
            transform: [{ translateY: panelTranslateY }],
            height: panelHeight,
          },
        ]}
      >
        <Text style={styles.panelTitle}>Thêm Banner</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <Text>Chọn ảnh từ thư viện</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
          <Text style={styles.uploadText}>Tải lên</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ManageBannersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerText: { fontSize: 20, fontWeight: 'bold', marginLeft: 12 },
  bannerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  bannerImage: { width: 100, height: 60, borderRadius: 8 },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 10,
  },
  addPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 20,
    shadowColor: '#000',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  uploadBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
  },
});
