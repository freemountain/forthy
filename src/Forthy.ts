import Stack from "./Stack";
import IWord from "./interfaces/IWord";
import IMark from "./interfaces/IMark";
import IDictionary from "./interfaces/IDictionary";
import IContext from "./interfaces/IContext";
import dictionary from "./dictionary";
import { reduceMarks } from "./utils";

class Forthy implements IContext {
    public tokens: string[];
    public stack: Stack<number>;
    public returnStack: Stack<number>;
    public dictionary: IDictionary;
    public parseStack: Stack<Array<IWord | IMark>>

    constructor() {
        this.tokens = [];
        this.stack = new Stack<number>();
        this.returnStack = new Stack<number>();
        this.parseStack = new Stack<Array<IWord | IMark>>();
        this.dictionary = Object.assign({}, dictionary);
    }

    public parse(end?: string): IWord[] {
        this.parseStack.push([]);
        let token: string = this.tokens.shift();
        let word: IWord;

        while (token !== end) {
            if (this.dictionary[token])
                word = this.dictionary[token];
            else {
                const n = parseInt(token, 10);
                if (isNaN(n)) throw new Error("unknown word" + token);
                word = (f: IContext) => f.stack.push(n)
            }

            if (word.parsing)
                word(this);
            else
                this.parseStack.top().push(word);
            token = this.tokens.shift();
        }

        return reduceMarks(this.parseStack.pop(), this.dictionary);
    }

    public exec(ary) {
        this.returnStack.push(0);
        while (this.returnStack.top() < ary.length) {
            ary[this.returnStack.top()](this);
            this.returnStack.change(ip => ip + 1);
        }
        this.returnStack.pop();
    }

    public run(source) {
        this.tokens = source.match(/"[^"]*"|\S+/g);
        this.exec(this.parse());
    }
}

export default Forthy;