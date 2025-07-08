import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppSelector } from '../redux/store';

export default function AddressScreen() {
    const router = useRouter();
    const [address, setAddress] = useState('');
    const currentUser = useAppSelector(state => state.auth.user);

    useEffect(() => {
        const fetchAddress = async () => {
            if (!currentUser) return;

            try {
                const res = await fetch(`http://192.168.1.10:3000/users/${currentUser.id}`);
                const user = await res.json();
                setAddress(user.address || '');
            } catch (err) {
                console.error('Lỗi lấy địa chỉ:', err);
            }
        };

        fetchAddress();
    }, [currentUser]);

    const handleSaveAddress = async () => {
        if (!address.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ');
            return;
        }

        if (!currentUser) return;

        try {
            const updatedUser = {
                ...currentUser,
                address: address,
            };

            await fetch(`http://192.168.1.10:3000/users/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });

            Alert.alert('Thành công', 'Địa chỉ đã lưu!');
            router.replace('/checkout'); // Quay về màn hình thanh toán
        } catch (err) {
            console.error('Lỗi cập nhật địa chỉ:', err);
            Alert.alert('Lỗi', 'Không thể lưu địa chỉ');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>📝 Nhập địa chỉ giao hàng</Text>
            <TextInput
                placeholder="Nhập địa chỉ..."
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAddress}>
                <Text style={styles.saveText}>Lưu</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
    },
    saveBtn: {
        backgroundColor: '#000',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
