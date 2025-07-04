// app/splash.tsx

import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/(tabs)/Login');
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        source={{ uri: 'https://i.pinimg.com/736x/ec/ba/43/ecba431d918574070666a2130248f535.jpg' }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Nền trắng hoặc màu thương hiệu
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',   // Co giãn theo kích thước màn hình
    height: '50%',  // Hoặc bạn có thể chỉnh lại nếu muốn hình đầy màn
  },
});
