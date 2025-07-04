import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { AppDispatch, RootState } from '../redux/store';

// Icon
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // hiện ẩn mật khẩu
  const [inputError, setInputError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setInputError('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }
    // kiểm tra mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setInputError('Email không hợp lệ!');
      return;
    }

    if (password.length < 6) {
      setInputError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setInputError('');

    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      Alert.alert('Thành công', 'Đăng nhập thành công!');
      router.replace('/(tabs)/Home');
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
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={24}
            color="#666"
            style={{ paddingRight: 10 }}
          />
        </Pressable>
      </View>

      {inputError !== '' && <Text style={styles.error}>{inputError}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Đang xử lý...' : 'Đăng nhập'}</Text>
      </TouchableOpacity>

      <View style={styles.loginPrompt}>
        <Text style={{ color: '#333' }}>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/Register')}>
          <Text style={styles.registerLink}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 25, textAlign: 'center', color: '#1e90ff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16
  },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16
  },
  button: { backgroundColor: '#1e90ff', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25
  },
  registerLink: {
    color: '#1e90ff',
    fontWeight: 'bold',
    marginLeft: 4
  }
});
