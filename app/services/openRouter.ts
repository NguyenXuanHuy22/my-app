import axios from 'axios';



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


