const PerplexityAPI = require('../../src/perplexity/api');

const perplexityMenu = async () => {
    console.log('Input your request for Perplexity:');


    const apiKey = process.env.API_KEY;
    const perplexity = new PerplexityAPI(apiKey);
    
    async function startProgram() {
        try {
            const data = await perplexity.fetchData('your_endpoint_here', { /* your parameters here */ });
            console.log('Data fetched successfully:', data);
        } catch (error) {
            console.error('Error starting program:', error);
        }
    }
    
    startProgram();



    perplexity.startProgram();
};

module.exports = perplexityMenu