import IContext from "./interfaces/IContext";
import IDictionary from "./interfaces/IDictionary";

export default class VM implements IContext {
    public program: string[];
    public stack: number[];
    public returnStack: Array<{ word?: string, instructionPointer: number; }>
    public currentWord: string | null;
    public instructionPointer: number;
    public halted: boolean;
    public compiling: boolean;
    public dictionary: IDictionary;

    constructor(instructions: string[], dictionaries: IDictionary[]) {
        this.program = instructions;
        this.stack = [];
        this.returnStack = [];

        this.halted = false;
        this.compiling = false;
        this.currentWord = null;
        this.instructionPointer = 0;

        this.dictionary = Object.assign({}, ...dictionaries);
    }

    public run(steps: number = Infinity): void {
        let count = 0;
        while (!this.halted && count <= steps ) {
            this.step();
            count += 1;
        }
    }

    public step() {
        if (this.compiling) {
            const next = this.program[this.instructionPointer];

            if (next !== ";") {
                console.log("push to", this.currentWord, next);
                this.dictionary[this.currentWord].push(next);
            } else {
                console.log("end def");
                this.currentWord = null;
                this.compiling = false;
                this.returnStack = [];
            }

            this.instructionPointer += 1; 
            return;      
        }

        const inWord = typeof this.currentWord === "string";
        const target = inWord ? this.dictionary[this.currentWord] : this.program;
        const next = target[this.instructionPointer];

        if (this.instructionPointer >= target.length) {
            if (!inWord) throw new Error("Program overflow");

            const returnStackHead = this.returnStack[this.returnStack.length - 1];

            this.instructionPointer = returnStackHead.instructionPointer;
            this.currentWord = returnStackHead.word;
            this.returnStack.pop();

            return;
        }

        if (typeof next === "function") {
            this.instructionPointer += 1;
            return next(this);
        }

        if (this.dictionary[next]) {
            this.returnStack.push({ instructionPointer: this.instructionPointer + 1, word: this.currentWord });
            this.currentWord = next;
            this.instructionPointer = 0;
            return;
        };

        const n = parseInt(next, 10);
        if (isNaN(n)) throw new Error(`Unkown word "${next}"`);
        this.stack.push(n);
        this.instructionPointer += 1;
    }

    public popStack() {
        if (this.stack.length === 0) throw new Error("Stack underflow");
        return this.stack.pop();
    }
};