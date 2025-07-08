// Màn Quản lý thông tin
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';

const ProfileScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Ảnh đại diện */}
      <Image
        source={{ uri: 'https://i.pinimg.com/736x/ec/ba/43/ecba431d918574070666a2130248f535.jpg' }}
        style={styles.image}
        resizeMode="contain"
      />

      
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: '90%',
    height: '50%',
    borderRadius: 10,
  },
 
});
