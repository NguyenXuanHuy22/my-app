import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const UnauthorizedScreen = () => {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bạn không có quyền truy cập trang này.</Text>
        </View>
    );
};

export default UnauthorizedScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        padding: 16,
    },
});
