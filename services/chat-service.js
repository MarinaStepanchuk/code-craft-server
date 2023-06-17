export default class ChatService {
  static async getMessage(message) {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer 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`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 100,
      }),
    };

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      options
    );

    const data = await response.json();

    return data.choices[0].message;
  }
}
