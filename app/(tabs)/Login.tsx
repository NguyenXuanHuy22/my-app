// src/screens/LoginScreen.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { AppDispatch, RootState } from '../redux/store';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { error, loading, currentUser } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      Alert.alert('Thành công', 'Đăng nhập thành công!');
      router.replace('/(tabs)/Home'); // Điều hướng về Home
    } else {
      Alert.alert('Thất bại', resultAction.payload as string);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Đang xử lý...' : 'Đăng nhập'}</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
       <View style={styles.loginPrompt}>
              <Text style={{ color: '#333' }}>Bạn chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/Register')}>
                <Text style={{ color: '#1e90ff', fontWeight: 'bold' }}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
    </View>
    
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15 },
  button: { backgroundColor: '#1e90ff', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  error: { color: 'red', marginTop: 10, textAlign: 'center' },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  }
});
