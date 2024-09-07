(async () => {
    // ./template/index.js

    const TaskExecutor = require('./TaskExecutorTemplate'); // Import the TaskExecutor
    const fs = require('fs'); // Import fs
    const path = require('path'); // Import path
    const apiKeys = {
        perplexity: process.env.PERPLEXITY_API_KEY, // Ensure your API keys are set in the environment
        chatgpt: process.env.OPENAI_API_KEY
    };

    const executor = new TaskExecutor(apiKeys); // Create an instance of TaskExecutor

    const inquirer = require('inquirer'); // Import inquirer

    // Load the configuration files from the config directory
    const configDir = path.join(__dirname, 'config');
    const configFiles = fs.readdirSync(configDir).filter(file => file.endsWith('.json')); // Get JSON files

    // Prompt user to select a config file
    async function selectConfigFile() {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'configFile',
                message: 'Select a configuration file to execute:',
                choices: configFiles,
            },
        ]);
        return path.join(configDir, answers.configFile); // Return the selected config file path
    }

    // Update runTasks to use the selected config file
    async function runTasks() {
        try {
            const configFilePath = await selectConfigFile(); // Get the selected config file path
            executor.loadConfig(configFilePath); // Load the selected configuration file
            await executor.run();
        } catch (error) {
            console.error(`Execution failed: ${error.message}`);
        }
    }

    await runTasks();
})();