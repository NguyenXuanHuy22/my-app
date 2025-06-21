// app/splash.tsx

import { useRouter } from 'expo-router'; // ✅ Đúng hook để điều hướng
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => {
  const router = useRouter(); // ✅ Gọi đúng hook

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/(tabs)/Register'); // ✅ Chuyển về màn hình chính (index.tsx hoặc (tabs)/index.tsx)
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng bạn!</Text>
      {/* <ActivityIndicator size="large" color="#0000ff" /> */}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  }
});
