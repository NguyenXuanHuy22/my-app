import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from '../redux/store';

export default function AddressScreen() {
    const router = useRouter();
    const [address, setAddress] = useState('');
    const currentUser = useAppSelector(state => state.auth.user);

    // Load địa chỉ đã lưu trước đó
    useEffect(() => {
        const loadAddress = async () => {
            if (!currentUser) return;
            const saved = await AsyncStorage.getItem(`user_address_${currentUser.id}`);
            if (saved) setAddress(saved);
        };
        loadAddress();
    }, [currentUser]);

    const handleSaveAddress = async () => {
        if (!address.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ');
            return;
        }

        try {
            if (!currentUser) return;
            await AsyncStorage.setItem(`user_address_${currentUser.id}`, address);
            Alert.alert('Thành công', 'Địa chỉ đã lưu!');
            router.replace('/checkout');
        } catch (err) {
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
