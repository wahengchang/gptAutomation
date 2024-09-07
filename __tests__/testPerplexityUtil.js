const PerplexityUtil = require('../src/perplexity/util');

describe('PerplexityUtil', () => {
    let perplexityUtil;
    const apiKey = process.env.PERPLEXITY_API_KEY;

    beforeAll(() => {
        perplexityUtil = new PerplexityUtil(apiKey);
    });

    test('getResponse returns data for valid input', async () => {
        const userInput = "How many fingers are in one hand?";
        const data = await perplexityUtil.getCompletion(userInput);
        
        expect(data).toBeDefined();
        expect(data.choices).toBeTruthy();
        expect(data.choices[0].message.content).toContain("5");
    });

    test('getResponse handles errors gracefully', async () => {
        const userInput = ""; // Invalid input to trigger an error

        await expect(perplexityUtil.getCompletion(userInput)).rejects.toThrow();
    });

    test('getConversation returns data for valid input', async () => {
        const preMessage = [
            { role: "system", content: "Be precise and concise." },
        ];
        const newMessage = "How many fingers are in one hand?"
        const data = await perplexityUtil.getConversation(preMessage, newMessage);
        
        expect(data).toBeDefined();
        expect(data.choices).toBeTruthy();
        expect(data.choices[0].message.content).toContain("5");
    });
    test('getConversation returns data for valid input', async () => {
        const preMessage = [
            { role: "system", content: "Be precise and concise." },
            { role: "user", content: "What food do Anna like?" },
            { role: "assistant", content: "sushi" },
            { role: "user", content: "What drink do Anna like?" },
            { role: "assistant", content: "Matcha tea" },
        ];
        const newMessage = "base on the information above, where does Anna come from(most possible)? (reply in short)"
        const data = await perplexityUtil.getConversation(preMessage, newMessage);
        
        expect(data).toBeDefined();
        expect(data.choices).toBeTruthy();
        console.log(data.choices[0].message)
        expect(data.choices[0].message.content).toContain("Japan");
    });
    test('getConversation handles errors gracefully', async () => {
        const preMessage = []; // Invalid input to trigger an error
        const newMessage = "";

        await expect(perplexityUtil.getConversation(preMessage, newMessage)).rejects.toThrow();
    });
});