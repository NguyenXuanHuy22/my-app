import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { addToCart } from '../../redux/slices/cartSlice';
import { selectProductById } from '../../redux/slices/productsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';

const sizes = ['S', 'M', 'L'];

export default function ProductDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams(); // ✅ Lấy id từ URL

    const product = useAppSelector(selectProductById(id as string));
    const [selectedSize, setSelectedSize] = useState('M');
    const [isFavorite, setIsFavorite] = useState(false);
    const currentUser = useAppSelector(state => state.auth.currentUser);
    const dispatch = useAppDispatch();

    if (!product) return <Text style={{ padding: 20 }}>Không tìm thấy sản phẩm</Text>;

    const handleAddToCart = () => {
        if (!currentUser) {
            Alert.alert("Vui lòng đăng nhập", "Bạn cần đăng nhập để thêm vào giỏ hàng");
            return;
        }

        dispatch(
            addToCart({
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                size: selectedSize,
                quantity: 1,
                userId: currentUser.id,
            })
        );

        router.push('/cart'); // 👉 chuyển sang giỏ hàng
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/Home')}>
                    <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sản phẩm</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Image */}
            <Image source={{ uri: product.image }} style={styles.productImage} />

            {/* Name + Favorite */}
            <View style={styles.nameRow}>
                <Text style={styles.productName}>{product.name}</Text>
                <TouchableOpacity
                    style={styles.favoriteBtn}
                    onPress={() => setIsFavorite(!isFavorite)}
                >
                    <AntDesign
                        name={isFavorite ? 'heart' : 'hearto'}
                        size={20}
                        color={isFavorite ? 'red' : 'black'}
                    />
                </TouchableOpacity>
            </View>

            {/* Rating */}
            <View style={styles.ratingRow}>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.ratingText}>4.0/5 </Text>
            </View>

            {/* Description */}
            <Text style={styles.description}>{product.description}</Text>

            {/* Size */}
            <Text style={styles.sectionTitle}>Chọn size</Text>
            <View style={styles.sizeContainer}>
                {sizes.map((size) => (
                    <TouchableOpacity
                        key={size}
                        style={[styles.sizeBox, selectedSize === size && styles.sizeBoxSelected]}
                        onPress={() => setSelectedSize(size)}
                    >
                        <Text style={selectedSize === size ? styles.sizeTextSelected : styles.sizeText}>
                            {size}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.price}>{product.price} VND</Text>
                <TouchableOpacity
                    style={styles.cartButton}
                    onPress={handleAddToCart}
                >
                    <Ionicons name="cart-outline" size={20} color="#fff" />
                    <Text style={styles.cartText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productImage: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        marginBottom: 16,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
    },
    favoriteBtn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 6,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    star: {
        fontSize: 16,
        marginRight: 4,
    },
    ratingText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    description: {
        fontSize: 13,
        color: '#555',
        marginBottom: 12,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    sizeContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    sizeBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    sizeBoxSelected: {
        borderColor: '#7d4cff',
    },
    sizeText: {
        fontSize: 14,
    },
    sizeTextSelected: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#7d4cff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 30,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cartButton: {
        flexDirection: 'row',
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignItems: 'center',
        gap: 6,
    },
    cartText: {
        color: '#fff',
        fontWeight: '600',
    },
});
