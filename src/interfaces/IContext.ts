interface IContext {
    program: string[];
    stack: number[];
    returnStack: Array<{ word?: string, instructionPointer: number;}>

    instructionPointer: number;
    currentWord: null|string;

    halted: boolean;
    compiling: boolean;

    dictionary: {
        [name: string]: Array<((ctx: IContext) => void)| string>
    }

    popStack(): number;
};

export default IContext;