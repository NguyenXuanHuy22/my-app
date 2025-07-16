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
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const currentUser = useAppSelector(state => state.auth.user);

    useEffect(() => {
        const fetchUser = async () => {
            if (!currentUser) return;

            try {
                const res = await fetch(`http://192.168.1.13:3000/users/${currentUser.id}`);
                const user = await res.json();
                setAddress(user.address || '');
                setName(user.name || '');
                setPhone(user.phone || '');
            } catch (err) {
                console.error('Lỗi lấy thông tin người dùng:', err);
            }
        };

        fetchUser();
    }, [currentUser]);

    const handleSaveAddress = async () => {
        if (!name.trim() || !phone.trim() || !address.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên, số điện thoại và địa chỉ');
            return;
        }

        if (!currentUser) return;

        try {
            const updatedUser = {
                ...currentUser,
                name,
                phone,
                address,
            };

            await fetch(`http://192.168.1.13:3000/users/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });

            Alert.alert('Thành công', 'Đã lưu thông tin giao hàng!');
            router.replace('/checkout'); // Quay lại màn hình thanh toán
        } catch (err) {
            console.error('Lỗi cập nhật:', err);
            Alert.alert('Lỗi', 'Không thể lưu thông tin');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📝 Nhập thông tin giao hàng</Text>

            <TextInput
                placeholder="Tên người nhận"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TextInput
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
            />

            <TextInput
                placeholder="Địa chỉ"
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
        marginBottom: 16,
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
