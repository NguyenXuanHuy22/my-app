import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // đường dẫn tùy dự án của bạn

const AccountScreen = () => {

    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    const role = user?.role;

    const MenuItem = ({
        icon,
        text,
        onPress,
    }: {
        icon: React.ReactNode;
        text: string;
        onPress?: () => void;
    }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.iconText}>
                {icon}
                <Text style={styles.menuText}>{text}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <Text style={styles.header}>Tài khoản</Text>

                {role === 'admin' ? (
                    <>
                        <MenuItem
                            icon={<Ionicons name="cube-outline" size={20} color="#000" />}
                            text="Quản lý sản phẩm"
                            onPress={() => router.push('/admin/manage-products')}
                        />
                        <MenuItem
                            icon={<MaterialIcons name="receipt-long" size={20} color="#000" />}
                            text="Quản lý đơn hàng"
                            onPress={() => router.push('/admin/manage-products')}
                        />
                        <MenuItem
                            icon={
                                <MaterialCommunityIcons name="image-area" size={20} color="#000" />
                            }
                            text="Quản lý banner"
                            onPress={() => router.push('/admin/manage-products')}
                        />
                    </>
                ) : (
                    <>
                        <MenuItem
                            icon={<MaterialIcons name="inventory" size={20} color="#000" />}
                            text="Đơn hàng của tôi"
                            onPress={() => router.push('/orders')}
                        />
                        <MenuItem
                            icon={<Ionicons name="person-outline" size={20} color="#000" />}
                            text="Thông tin"
                            onPress={() => router.push('/profile')}
                        />
                    </>
                )}

                <View style={styles.separator} />

                <MenuItem
                    icon={<Feather name="help-circle" size={20} color="#000" />}
                    text="FAQs"
                />
                <MenuItem
                    icon={<Feather name="headphones" size={20} color="#000" />}
                    text="Help Center"
                />

                <View style={styles.separator} />

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => {
                        // TODO: dispatch logout và router.replace('/login')
                    }}
                >
                    <AntDesign name="logout" size={20} color="red" />
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Bottom tab menu */}
            <View style={styles.bottomMenu}>
                <TouchableOpacity style={styles.menuItemm} onPress={() => router.push('/Home')}>
                    <Ionicons name="home-outline" size={24} color="black" />
                    <Text style={styles.menuTextt}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItemm} onPress={() => router.push('/cart')}>
                    <Ionicons name="cart-outline" size={24} color="black" />
                    <Text style={styles.menuTextt}>Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItemm} onPress={() => router.push('/profile')}>
                    <Ionicons name="person-outline" size={24} color="black" />
                    <Text style={styles.menuTextt}>Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AccountScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    menuItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconText: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    menuText: {
        fontSize: 16,
        color: '#000',
    },
    separator: {
        height: 10,
        backgroundColor: '#f4f4f4',
        marginVertical: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        color: 'red',
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
    menuItemm: {
        alignItems: 'center',
    },
    menuTextt: {
        fontSize: 12,
        marginTop: 4,
    },
});
