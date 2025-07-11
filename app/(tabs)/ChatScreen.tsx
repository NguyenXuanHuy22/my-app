// screens/ChatScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addUserMessage, sendMessageToAI } from '../redux/slices/chatSlice';
import { AppDispatch, RootState } from '../redux/store';

const ChatScreen = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading } = useSelector((state: RootState) => state.chat);
  const router = useRouter();

  const handleSend = () => {
    if (!input.trim()) return;
    dispatch(addUserMessage(input));
    dispatch(sendMessageToAI(input));
    setInput('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        }}
      >
        <TouchableOpacity onPress={() =>  router.replace('/(tabs)/AccountScreen')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 12 }}>
          Liên hệ tư vấn
        </Text>
      </View>

      {/* Chat messages */}
      <FlatList
        data={[...messages].reverse()}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: item.role === 'user' ? '#DCF8C6' : '#F1F1F1',
              padding: 12,
              borderRadius: 16,
              marginVertical: 6,
              marginHorizontal: 10,
              maxWidth: '75%',
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
        inverted
      />

      {/* Loading */}
      {loading && (
        <ActivityIndicator size="small" color="#666" style={{ marginBottom: 8 }} />
      )}

      {/* Input box */}
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          borderTopWidth: 1,
          borderColor: '#eee',
          alignItems: 'center',
          backgroundColor: '#fafafa',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            height: 44,
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 22,
            paddingHorizontal: 16,
            fontSize: 16,
            marginRight: 8,
          }}
          placeholder="Hỏi AI về sản phẩm..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#00b894',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
