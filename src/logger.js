const chalk = require('chalk');

const logger = {
    logQuestion: (question, hidePrefix = false) => {
        const prefix = hidePrefix ? '' : 'Question: ';
        console.log(chalk.blue(`${prefix}${question}`));
    },
    logAnswer: (answer, hidePrefix = false) => {
        const prefix = hidePrefix ? '' : 'Answer: ';
        console.log(chalk.green(`${prefix}${answer}`));
    },
    logUsage: (totalTokens, type) => {
        let pricePerToken = 0.000006; // Default price per token
        if (type === 'ChatGPT') {
            pricePerToken = 0.000005; // Adjusted price per token for ChatGPT
        }
        console.log(chalk.yellow(`[${type}] Usage Summary: ${totalTokens} tokens used. Estimated price: ${(totalTokens * pricePerToken).toFixed(6)} USD`));
    },
    logError: (error) => {
        console.error(chalk.red(`Error: ${error.message}`));
    }
};

module.exports = logger;