import IDictionary from "./../interfaces/IDictionary";
import IContext from "./../interfaces/IContext";

export default (): IDictionary => ({
    halt: [(ctx: IContext) => {
        ctx.halted = true;
    }],
    noop: [(ctx: IContext) => {
        // do nothing
    }],
    dup: [(ctx: IContext) => {
        const n = ctx.popStack();
        ctx.stack.push(n);
        ctx.stack.push(n);
    }],
    drop: [(ctx: IContext) => {
        ctx.popStack();
    }],
    swap: [(ctx: IContext) => {
        const b = ctx.popStack();
        const a = ctx.popStack();
        ctx.stack.push(a);
        ctx.stack.push(b);
    }],
    "+": [(ctx: IContext) => {
        const b = ctx.popStack();
        const a = ctx.popStack();
        ctx.stack.push(a + b);
    }],
    "-": [(ctx: IContext) => {
        const b = ctx.popStack();
        const a = ctx.popStack();
        ctx.stack.push(a - b);
    }],
    ":": [(ctx: IContext) => {
        if(ctx.compiling) throw new Error("already in compiling mode");
        if(ctx.returnStack.length !== 1) throw new Error("canot recusiv define words");
        if(ctx.instructionPointer >= ctx.program.length) throw new Error("Program overflow");

        const { instructionPointer } = ctx.returnStack.pop();
        const word = ctx.program[instructionPointer];

        ctx.dictionary[word] = [];
        ctx.currentWord = word;
        ctx.compiling = true;
        ctx.instructionPointer = instructionPointer + 1;
    }],
    "jmp": [(ctx: IContext) => {
        const to = ctx.popStack();
        const { word, instructionPointer } = ctx.returnStack.pop();

        ctx.currentWord = word;
        ctx.instructionPointer = to;
        ctx.instructionPointer = to;
    }],
});