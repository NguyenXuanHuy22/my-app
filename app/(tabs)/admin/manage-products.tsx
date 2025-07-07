import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const ManageProducts = () => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.replace('./unauthorized'); // chặn user
        }
    }, [user]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Quản lý sản phẩm</Text>
        </View>
    );
};

export default ManageProducts;