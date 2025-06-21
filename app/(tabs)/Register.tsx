import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, registerUser } from "../redux/slices/authSlice";
import { RootState } from "../redux/store";

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { users } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, []);

  const handleRegister = () => {
    // Kiểm tra rỗng
    if (!name || !email || !phone || !password || !address) {
      Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }

    // Kiểm tra email
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError(true);
      return;
    }
    setEmailError(false);

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);

    // Kiểm tra trùng email/phone
    const isExist = users.some(user => user.email === email || user.phone === phone);
    if (isExist) {
      Alert.alert("Lỗi", "Email hoặc số điện thoại đã tồn tại!");
      return;
    }

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
      .then((res: any) => {
        if (!res.error) {
          Alert.alert("Thành công", "Đăng ký tài khoản thành công!");
          setName('');
          setEmail('');
          setPhone('');
          setPassword('');
          setAddress('');
          router.replace('/(tabs)/Login'); // ✅ chuyển đến LoginScreen sau khi đăng ký
        } else {
          Alert.alert("Lỗi", "Không thể đăng ký.");
        }
      })
      .catch(() => Alert.alert("Lỗi", "Không thể đăng ký."));
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
        style={[styles.input, emailError && styles.errorInput]}
        placeholder="Nhập email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {emailError && <Text style={styles.errorText}>Email không hợp lệ</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={[styles.input, passwordError && styles.errorInput]}
        placeholder="Nhập mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {passwordError && <Text style={styles.errorText}>Mật khẩu phải từ 6 ký tự trở lên</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ"
        value={address}
        onChangeText={setAddress}
      />

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

      {/* ✅ Đã có tài khoản? */}
      <View style={styles.loginPrompt}>
        <Text style={{ color: '#333' }}>Bạn đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/Login')}>
          <Text style={{ color: '#1e90ff', fontWeight: 'bold' }}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 5, padding: 10, marginBottom: 10
  },
  errorInput: { borderColor: 'red' },
  errorText: { color: 'red', marginBottom: 10 },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15, borderRadius: 5,
    alignItems: 'center', marginTop: 10
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  }
});

export default RegisterScreen;
