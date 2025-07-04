import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, registerUser } from "../redux/slices/authSlice";
import { RootState } from "../redux/store";

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁 Hiện/ẩn mật khẩu

  const dispatch = useDispatch();
  const router = useRouter();
  const { users } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, []);

  const handleRegister = async () => {
    //  Kiểm tra thiếu thông tin
    if (!name || !email || !phone || !password || !address) {
      setErrorMessage('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    //  Email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Email không hợp lệ.');
      return;
    }

    //  SĐT Việt Nam hợp lệ
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage('Số điện thoại không hợp lệ (phải đủ 10 số và đúng đầu số Việt Nam).');
      return;
    }

    //  Mật khẩu >= 6 ký tự
    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải từ 6 ký tự trở lên.');
      return;
    }

    //  Email hoặc sđt trùng
    const isExist = users.some(user => user.email === email || user.phone === phone);
    if (isExist) {
      setErrorMessage('Email hoặc số điện thoại đã tồn tại!');
      return;
    }

    //  Xóa lỗi trước khi đăng ký
    setErrorMessage('');

    const newUser = {
      id: generateId(),
      name,
      email,
      phone,
      password,
      address,
      role: 'user',
    };

    dispatch(registerUser(newUser) as any)
      .then(async (res: any) => {
        if (!res.error) {
          // Lưu thông tin vào AsyncStorage sau khi đăng ký
          await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));

          Alert.alert("Thành công", "Đăng ký tài khoản thành công!");
          setName('');
          setEmail('');
          setPhone('');
          setPassword('');
          setAddress('');
          router.replace('/(tabs)/Login');
        } else {
          setErrorMessage('Đăng ký thất bại. Vui lòng thử lại.');
        }
      })
      .catch(() => setErrorMessage('Đã xảy ra lỗi khi đăng ký.'));
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

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

      {/*  Mật khẩu + icon toggle */}
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
          !(name && email && phone && password && address) && { backgroundColor: '#aaa' }
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10, color: '#1e90ff', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, padding: 12, marginBottom: 12,
    fontSize: 16, backgroundColor: '#fff'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  }
});
