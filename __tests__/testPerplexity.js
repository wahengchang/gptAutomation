const PerplexityAPI = require('../src/perplexity/api');

test('fetchData returns data', async () => {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    const api = new PerplexityAPI(apiKey);
    const params = {
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
            { role: "system", content: "Be precise and concise." },
            { role: "user", content: "How many finger in one hand? (reply only number,digit)" }
        ],
        // max_tokens: 2500,
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
    const data = await api.fetchData('chat/completions', params);
    expect(data).toBeDefined();
    expect(data.choices).toBeTruthy();
    expect(data.choices[0].message.content).toContain("5");
});
