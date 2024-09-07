const ChatGPTUtil = require('../src/chatgpt/util');

describe('ChatGPTUtil', () => {
    let chatgptUtil;
    const apiKey = process.env.OPENAI_API_KEY;

    beforeAll(() => {
        chatgptUtil = new ChatGPTUtil(apiKey);
    });

    test('getCompletion returns data for valid input', async () => {
        const userInput = "How many fingers are in one hand? (reply in number)";
        const data = await chatgptUtil.getCompletion(userInput);
        
        expect(data).toBeDefined();
        expect(data.choices).toBeTruthy();
        expect(data.choices[0].message.content).toContain("5");
    });

    test('getCompletion handles errors gracefully', async () => {
        const userInput = ""; // Invalid input to trigger an error

        await expect(chatgptUtil.getCompletion(userInput)).rejects.toThrow();
    });

    test('getConversation returns data for valid input', async () => {
        const preMessage = [
            { role: "system", content: "Be precise and concise." },
        ];
        const newMessage = "How many fingers are in one hand?  (reply in number)";
        const data = await chatgptUtil.getConversation(preMessage, newMessage);
        
        expect(data).toBeDefined();
        expect(data.choices).toBeTruthy();
        expect(data.choices[0].message.content).toContain("5");
    });

    test('getConversation returns data for complex valid input', async () => {
        const preMessage = [
            { role: "system", content: "Be precise and concise." },
            { role: "user", content: "What food do Anna like?" },
            { role: "assistant", content: "sushi" },
            { role: "user", content: "What drink do Anna like?" },
            { role: "assistant", content: "Matcha tea" },
        ];
        const newMessage = "Based on the information above, where does Anna come from (most possible)? (reply in short)";
        const data = await chatgptUtil.getConversation(preMessage, newMessage);
        
        expect(data).toBeDefined();
        expect(data.choices).toBeTruthy();
        expect(data.choices[0].message.content).toContain("Japan");
    });

    test('getConversation handles errors gracefully', async () => {
        const preMessage = []; // Invalid input to trigger an error
        const newMessage = "";

        await expect(chatgptUtil.getConversation(preMessage, newMessage)).rejects.toThrow();
    });
});