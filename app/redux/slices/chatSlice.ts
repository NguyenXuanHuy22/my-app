import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOpenRouterResponse } from '../../(tabs)/services/openRouter';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
};

export const sendMessageToAI = createAsyncThunk<ChatMessage, string>(
  'chat/sendMessageToAI',
  async (message: string) => {
    const response = await getOpenRouterResponse(message);
    return { role: 'assistant', content: response };
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: 'user', content: action.payload });
    },
    clearChat: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToAI.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessageToAI.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessageToAI.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addUserMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
