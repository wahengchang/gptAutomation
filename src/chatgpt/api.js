const axios = require('axios');

class ChatGPTAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.openai.com/v1'; // Example base URL
    }

    static get defaultParams() {
        return {
            model: "gpt-3.5-turbo", // Example model
            messages: [
                { role: "system", content: "Be precise and concise." },
            ],
            temperature: 0.2,
            top_p: 0.9,
            presence_penalty: 0,
            frequency_penalty: 1,
            // max_tokens: 50 
        };
    }
    async fetchData(endpoint, params ) {
        // Check for missing fields in params and use default if missing
        const defaultParams = ChatGPTAPI.defaultParams;
        const updatedParams = {
            model: params.model || defaultParams.model,
            messages: params.messages || defaultParams.messages,
            temperature: params.temperature || defaultParams.temperature,
            top_p: params.top_p || defaultParams.top_p,
            presence_penalty: params.presence_penalty || defaultParams.presence_penalty,
            frequency_penalty: params.frequency_penalty || defaultParams.frequency_penalty,
            max_tokens: params.max_tokens || defaultParams.max_tokens
        };

        try {
            const response = await axios.post(`${this.baseURL}/${endpoint}`, updatedParams, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

module.exports = ChatGPTAPI;