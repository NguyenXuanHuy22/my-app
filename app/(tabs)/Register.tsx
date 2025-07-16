import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUsers, registerUser } from '../redux/slices/authSlice';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { users } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !address) {
      setErrorMessage('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Email không hợp lệ.');
      return;
    }

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage('Số điện thoại không hợp lệ.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải từ 6 ký tự trở lên.');
      return;
    }

    const isExist = users.some(
      (user) => user.email === email || user.phone === phone
    );
    if (isExist) {
      setErrorMessage('Email hoặc số điện thoại đã tồn tại!');
      return;
    }

    setErrorMessage('');

    const newUser = {
      name,
      email,
      phone,
      password,
      address,
      role: 'user',
    };

    try {
      const res = await dispatch(registerUser(newUser as any)).unwrap(); 
      await AsyncStorage.setItem('currentUser', JSON.stringify(res));

      Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setAddress('');
      router.replace('/(tabs)/Login');
    } catch (error) {
      setErrorMessage('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo tài khoản</Text>
      <Text style={styles.subtitle}>Hãy tạo một tài khoản cho bạn</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập tên của bạn"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ"
        value={address}
        onChangeText={setAddress}
      />

      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity
        style={[
          styles.button,
          !(name && email && phone && password && address) && { backgroundColor: '#aaa' },
        ]}
        onPress={handleRegister}
        disabled={!(name && email && phone && password && address)}
      >
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>

      <View style={styles.loginPrompt}>
        <Text style={{ color: '#333' }}>Bạn đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/Login')}>
          <Text style={{ color: '#1e90ff', fontWeight: 'bold' }}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});
