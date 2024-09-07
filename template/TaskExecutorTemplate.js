const fs = require('fs');
const PerplexityTask = require('./tasks/PerplexityTask');
const ChatGPTTask = require('./tasks/ChatGPTTask');
const UserInputTask = require('./tasks/UserInputTask'); // Import UserInputTask
const logger = require('../src/logger');

class TaskExecutor {
    constructor(apiKeys) {
        this.apiKeys = apiKeys; // { perplexity: 'your_perplexity_api_key', chatgpt: 'your_chatgpt_api_key' }
        this.tasks = [];
        this.outputs = {};
        this.totalTokensUsed = { Perplexity: 0, ChatGPT: 0 }; // Initialize total tokens used for each type
    }

    loadConfig(filePath) {
        try {
            const config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            this.validateConfig(config);
            this.tasks = config.tasks;
            this.tasks.forEach((task, index) => {
                logger.logQuestion(`Task ${index + 1}: [${task.type}]${task.id}`, true);
            });
        } catch (error) {
            logger.logError(`Failed to load configuration: ${error.message}`);
            throw error;
        }
    }

    validateConfig(config) {
        if (!Array.isArray(config.tasks)) {
            throw new Error("Invalid configuration format: 'tasks' should be an array.");
        }
    }
    async run() {
        for (const taskConfig of this.tasks) {
            this.validateTask(taskConfig);
            const input = this.resolveInput(taskConfig.input);
            let task = this.createTask(taskConfig, input);

            try {
                logger.logQuestion(`[Task ${taskConfig.id}] ${input}.`,true);
                await task.execute();
                this.outputs[taskConfig.output] = task.output;
                logger.logAnswer(`${task.output}`,true);
                // Update total tokens used for the task type
                this.totalTokensUsed[taskConfig.type] += task.total_tokens;
            } catch (error) {
                logger.logError(`Error executing task ${taskConfig.id}: ${error.message}`);
            }
        }
        logger.logAnswer("All tasks have been executed.",true);
        this.summarizeUsage();
    }

    validateTask(taskConfig) {
        if (taskConfig.type !== "Perplexity" && taskConfig.type !== "ChatGPT" && taskConfig.type !== "UserInput") {
            logger.logError(`Unknown task type: ${taskConfig.type}`);
            throw new Error(`Unsupported task type: ${taskConfig.type}`);
        }
    }

    createTask(taskConfig, input) {
        if (taskConfig.type === "Perplexity") {
            return new PerplexityTask(this.apiKeys.perplexity, input);
        } else if (taskConfig.type === "ChatGPT") {
            return new ChatGPTTask(this.apiKeys.chatgpt, input);
        } else if (taskConfig.type === "UserInput") {
            return new UserInputTask(input); // Create a new UserInputTask
        }
    }

    resolveInput(input) {
        return input.replace(/{(\w+)}/g, (_, key) => this.outputs[key] || '');
    }

    summarizeUsage() {
        Object.keys(this.totalTokensUsed).forEach(type => {
            if (!this.totalTokensUsed[type])return
            
            logger.logUsage(this.totalTokensUsed[type], type);
        });
    }
}

module.exports = TaskExecutor;