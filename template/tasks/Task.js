// ./template/Task.js

class Task {
    constructor(name) {
        this.name = name;
        this.inputs = [];
        this.output = null;
    }

    setInput(inputs) {
        this.inputs = inputs;
    }

    getOutput() {
        return this.output;
    }

    async execute() {
        throw new Error("Execute method must be implemented in subclasses");
    }
}

module.exports = Task;