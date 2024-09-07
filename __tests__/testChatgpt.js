const ChatGPTAPI = require('../src/chatgpt/api');

test('fetchData returns data', async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    const api = new ChatGPTAPI(apiKey);
    const params = {
        model: "gpt-3.5-turbo", // Example model
        messages: [
            { role: "system", content: "Be precise and concise." },
            { role: "user", content: "How many fingers are in one hand? (reply only number, digit)" }
        ],
        temperature: 0.2,
        top_p: 0.9,
        presence_penalty: 0,
        frequency_penalty: 1
    };
    
    const data = await api.fetchData('chat/completions', params);
    expect(data).toBeDefined();
    expect(data.choices).toBeTruthy();
    expect(data.choices[0].message.content).toContain("5");
});