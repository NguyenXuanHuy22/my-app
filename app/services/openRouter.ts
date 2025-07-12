import axios from 'axios';

const API_KEY = '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'; // Thay bằng API Key từ openrouter.ai

export const getOpenRouterResponse = async (userInput: string) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct', // hoặc 'openai/gpt-3.5-turbo'
        messages: [
          {
            role: 'system',
            content:
              'Bạn là một nhân viên tư vấn thời trang. Trả lời ngắn gọn, dễ hiểu.',
          },
          { role: 'user', content: userInput },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('❌ Lỗi gọi OpenRouter:', error);
    return 'Xin lỗi, có lỗi xảy ra khi kết nối với AI.';
  }
};


