const PerplexityAPI = require('./api');
const axios = require('axios');

class PerplexityUtil {
    constructor(apiKey, config) {
        this.api = new PerplexityAPI(apiKey);
        this.apiKey = apiKey;
        this.apiBase = 'https://api.perplexity.ai'; // Example base URL
        this.config = config || PerplexityUtil.defaultParams;
        this.validateParams(this.config);
    }

    static get defaultParams() {
        return {
            model: "llama-3.1-sonar-small-128k-online", // Set the default model to the cheapest option
            messages: [],
            temperature: 0.2,
            top_p: 0.9,
            return_citations: true,
            search_domain_filter: ["perplexity.ai"],
            return_images: false,
            return_related_questions: false,
            search_recency_filter: "month",
            top_k: 0,
            stream: false,
            presence_penalty: 0,
            frequency_penalty: 1
        };
    }

    validateParams(params) {
        if (!params || typeof params !== 'object') {
            throw new Error('Params must be an object');
        }
        if (!params.model || typeof params.model !== 'string') {
            throw new Error('Model must be a string');
        }
        if (typeof params.temperature !== 'number' || params.temperature < 0 || params.temperature > 1) {
            throw new Error('Temperature must be a number between 0 and 1');
        }
        if (typeof params.top_p !== 'number' || params.top_p < 0 || params.top_p > 1) {
            throw new Error('Top p must be a number between 0 and 1');
        }
        if (typeof params.return_citations !== 'boolean') {
            throw new Error('Return citations must be a boolean');
        }
        if (!Array.isArray(params.search_domain_filter)) {
            throw new Error('Search domain filter must be an array');
        }
        if (typeof params.return_images !== 'boolean') {
            throw new Error('Return images must be a boolean');
        }
        if (typeof params.return_related_questions !== 'boolean') {
            throw new Error('Return related questions must be a boolean');
        }
        if (typeof params.search_recency_filter !== 'string') {
            throw new Error('Search recency filter must be a string');
        }
        if (typeof params.top_k !== 'number' || params.top_k < 0) {
            throw new Error('Top k must be a non-negative number');
        }
        if (typeof params.stream !== 'boolean') {
            throw new Error('Stream must be a boolean');
        }
        if (typeof params.presence_penalty !== 'number' || params.presence_penalty < 0) {
            throw new Error('Presence penalty must be a non-negative number');
        }
        if (typeof params.frequency_penalty !== 'number' || params.frequency_penalty < 0) {
            throw new Error('Frequency penalty must be a non-negative number');
        }
    }

    async validateCompletionInput(userInput) {
        if (!userInput || userInput.trim() === '') {
            throw new Error('User input cannot be empty');
        }
    }

    async validateConversationPreMessage(input) {
        if (!Array.isArray(input) || input.length === 0) {
            throw new Error('Pre-message must be a non-empty array');
        }
        if (!input.every(message => typeof message === 'object' && message.hasOwnProperty('role') && message.hasOwnProperty('content'))) {
            throw new Error('Each pre-message item must be an object with role and content properties');
        }
    }

    async getCompletion(userInput) {
        await this.validateCompletionInput(userInput);
        this.config.messages[0] = { role: "system", content: "reply in short, precise and concise." },
            this.config.messages[1] = {
                role: "user",
                content: `${userInput}`
            };

        try {
            const response = await this.api.fetchData('chat/completions', this.config);
            return response;
        } catch (error) {
            console.error('Error fetching response:', error);
            throw error;
        }
    }
    async getConversation(preMessage = [], newMessage = '') {
        await this.validateConversationPreMessage(preMessage);
        const messages = [...preMessage, { role: "user", content: newMessage }]; 
        this.config.messages = [...messages]

        try {
            const response = await this.api.fetchData('chat/completions', this.config);
            return response;
        } catch (error) {
            console.error('Error fetching conversation:', error);
            throw error;
        }
    }
}

module.exports = PerplexityUtil;