const inquirer = require('inquirer');
const Task = require('./Task');

class UserInputTask extends Task {
    constructor(input) {
        super("User Input Task");
        this.input = input;
        this.output = null;
    }

    async execute() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'userInput',
                message: this.input,
            }
        ]);
        this.output = answers.userInput; // Store the user input
        return this.output;
    }
}

module.exports = UserInputTask;