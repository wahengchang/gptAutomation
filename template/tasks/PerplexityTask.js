const PerplexityUtil = require('../../src/perplexity/util');
const Task = require('./Task');

class PerplexityTask extends Task {
    constructor(apiKey, input) {
        super("Perplexity Task");
        this.util = new PerplexityUtil(apiKey);
        this.input = input;
        this.response = null;
        this.total_tokens = 0; // Added property to store total_tokens
    }
    async execute() {
        const response = await this.util.getCompletion(this.input);
        this.response = response; // Store the response in this
        this.output = response.choices[0].message.content;
        this.total_tokens = response.usage.total_tokens; // Store total_tokens in this
        return this.output;
    }
}

module.exports = PerplexityTask;
