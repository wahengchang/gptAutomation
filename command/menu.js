const inquirer = require('inquirer');
const PerplexityUtil = require('../src/perplexity/util');
const ChatGPTUtil = require('../src/chatgpt/util'); // Added ChatGPTUtil import
const logger = require('../src/logger');

const mainMenu = async () => {
    const { selection } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            message: 'Select a menu:',
            choices: ['Perplexity', 'ChatGPT']
        }
    ]);

    const actionMenu = async (_selection) => {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Select an action:',
                choices: ['Completion', 'Conversation']
            }
        ]);

        const handleCompletion = async (__selection, _action) => {
            const { userInput } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'userInput',
                    message: 'Please enter your request:'
                }
            ]);
            logger.logQuestion(userInput);
            let api;
            if (__selection === 'ChatGPT') {
                const apiKey = process.env.OPENAI_API_KEY;
                api = new ChatGPTUtil(apiKey);
            } else {
                const apiKey = process.env.PERPLEXITY_API_KEY;
                api = new PerplexityUtil(apiKey);
            }
            const data = await api.getCompletion(userInput);
            const answer = data.choices[0].message.content;
            logger.logAnswer(answer);
            logger.logUsage(data.usage.total_tokens, __selection);
        };

        const handleConversation = async (__selection, _action) => {
            let continueConversation = true;
            let currentConversation = [];

            const promptForPreMessages = async () => {
                const { preMessage } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'preMessage',
                        message: 'Please enter the pre-message for the conversation (comma-separated), or "stop" to exit:'
                    }
                ]);
                return preMessage;
            };

            const promptForNewMessage = async () => {
                const { newMessage } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'newMessage',
                        message: 'Please enter your new message for the conversation:'
                    }
                ]);
                return newMessage;
            };

            const preMessage = await promptForPreMessages();
            const systemMessage = preMessage.split(',').map(message => ({ role: "system", content: message.trim() }));
            currentConversation = currentConversation.concat(systemMessage)

            while (continueConversation) {
                const newMessage = await promptForNewMessage();
                if (!newMessage || newMessage.toLowerCase() === 'stop') {
                    continueConversation = false;
                    break;
                }
                logger.logQuestion(newMessage);

                let api;
                if (__selection === 'ChatGPT') {
                    const apiKey = process.env.OPENAI_API_KEY;
                    api = new ChatGPTUtil(apiKey);
                } else {
                    const apiKey = process.env.PERPLEXITY_API_KEY;
                    api = new PerplexityUtil(apiKey);
                }
                const data = await api.getConversation(currentConversation, newMessage);

                const answer = data.choices[0].message.content;
                logger.logAnswer(answer);
                currentConversation = [
                    ...currentConversation,
                    { role: "user", content: newMessage },
                    { role: "assistant", content: answer }
                ]
            }
        };

        if (action === 'Completion') {
            console.log('You selected Completion. Input your request:');
            await handleCompletion(_selection, action);
        } else if (action === 'Conversation') {
            console.log('You selected Conversation. Input your request:');
            await handleConversation(_selection, action);
        }
    };

    if (selection === 'ChatGPT' || selection === 'Perplexity') {
        await actionMenu(selection);
    }
};

module.exports = mainMenu;