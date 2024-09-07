// ./template/tasks/ChatGPTTaskTemplate.js

const ChatGPTUtil = require('../../src/chatgpt/util'); // Import the ChatGPT utility
const Task = require('./Task'); // Import the base Task class

class ChatGPTTask extends Task {
    constructor(apiKey, input) {
        super("ChatGPT Task"); // Call the parent constructor with the task name
        this.chatGPTUtil = new ChatGPTUtil(apiKey); // Initialize the ChatGPT utility with the provided API key
        this.input = input; // Set the input for the task
        this.response = null;
        this.total_tokens = 0; // Added property to store total_tokens
    }

    async execute() {
        try {
            const response = await this.chatGPTUtil.getCompletion(this.input);
            this.response = response; // Store the response in this
            this.output = response.choices[0].message.content;
            this.total_tokens = response.usage.total_tokens; // Store total_tokens in this
        } catch (error) {
            console.error(`Error in ChatGPT Task: ${error.message}`); // Log any errors
            throw error; // Rethrow the error to be handled by the TaskExecutor
        }
    }
}

module.exports = ChatGPTTask; // Export the ChatGPTTask class