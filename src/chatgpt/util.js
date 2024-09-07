const ChatGPTAPI = require('./api');

class ChatGPTUtil {
    constructor(apiKey) {
        this.api = new ChatGPTAPI(apiKey);
    }

    async validateCompletionInput(prompt) {
        if (!prompt || typeof prompt !== 'string') {
            throw new Error('Prompt must be a non-empty string');
        }
    }

    async validateConversationPreMessage(messages) {
        if (!Array.isArray(messages)) {
            throw new Error('Messages must be an array');
        }
        if (messages.length === 0) {
            throw new Error('Messages array cannot be empty');
        }
        for (const message of messages) {
            if (!message || typeof message !== 'object') {
                throw new Error('Each message must be an object');
            }
            if (!message.role || typeof message.role !== 'string') {
                throw new Error('Each message must have a role as a string');
            }
            if (!message.content || typeof message.content !== 'string') {
                throw new Error('Each message must have content as a string');
            }
        }
    }

    async getCompletion(prompt) {
        await this.validateCompletionInput(prompt);
        const params = {
            model: "gpt-3.5-turbo", // Example model
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        };

        try {
            const response = await this.api.fetchData('chat/completions', params);
            return response;
        } catch (error) {
            console.error('Error fetching completion:', error);
            throw error;
        }
    }

    async getConversation(preMessage = [], newMessage = '') {
        await this.validateConversationPreMessage(preMessage);
        const messages = [...preMessage, { role: "user", content: newMessage }]; 
        const params = {
            messages: messages,
        };

        try {
            const response = await this.api.fetchData('chat/completions', params);
            return response;
        } catch (error) {
            console.error('Error fetching conversation:', error);
            throw error;
        }
    }
}

module.exports = ChatGPTUtil;