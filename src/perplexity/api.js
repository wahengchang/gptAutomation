const axios = require('axios');

class PerplexityAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.perplexity.ai'; // Example base URL
    }

    static get defaultParams() {
        return {
            model: "llama-3.1-sonar-small-128k-online", // Set the default model to the cheapest option
            messages: [
                { role: "system", content: "Be precise and concise." },
                { role: "user", content: "How many finger in one hand? (reply only number,digit)" }
            ],
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

    async fetchData(endpoint, params) {
        // Check for missing fields in params and use default if missing
        const defaultParams = PerplexityAPI.defaultParams;
        const updatedParams = {
            model: params.model || defaultParams.model,
            messages: params.messages || defaultParams.messages,
            temperature: params.temperature || defaultParams.temperature,
            top_p: params.top_p || defaultParams.top_p,
            return_citations: params.return_citations || defaultParams.return_citations,
            search_domain_filter: params.search_domain_filter || defaultParams.search_domain_filter,
            return_images: params.return_images || defaultParams.return_images,
            return_related_questions: params.return_related_questions || defaultParams.return_related_questions,
            search_recency_filter: params.search_recency_filter || defaultParams.search_recency_filter,
            top_k: params.top_k || defaultParams.top_k,
            stream: params.stream || defaultParams.stream,
            presence_penalty: params.presence_penalty || defaultParams.presence_penalty,
            frequency_penalty: params.frequency_penalty || defaultParams.frequency_penalty
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

module.exports = PerplexityAPI;