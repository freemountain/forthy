import Stack from "../Stack";
import IWord from "./IWord";
import IMark from "./IMark";
import IDictionary from "./IDictionary";

interface IContext {
    words: string[];
    stack: Stack<number>;
    returnStack: Stack<number>;
    dictionary: IDictionary;
    parseStack: Stack<Array<IWord | IMark>>

    parse(end?: string): IWord[];
    exec(ary);
}

export default IContext;
