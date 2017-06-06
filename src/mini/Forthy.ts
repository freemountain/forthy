import Stack from "./Stack";
import IWord from "./interfaces/IWord";
import IMark from "./interfaces/IMark";
import IDictionary from "./interfaces/IDictionary";
import IContext from "./interfaces/IContext";
import dictionary from "./dictionary";

class Forthy implements IContext {
    public words: string[];
    public stack: Stack<number>;
    public returnStack: Stack<number>;
    public dictionary: IDictionary;
    public parseStack: Stack<Array<IWord | IMark>>

    constructor() {
        this.words = [];
        this.stack = new Stack<number>();
        this.returnStack = new Stack<number>();
        this.parseStack = new Stack<Array<IWord | IMark>>();
        this.dictionary = Object.assign({}, dictionary);
    }

    public parse(end?: string): IWord[] {
        this.parseStack.push([]);
        let t: string = this.words.shift();
        let f: IWord;
        while (t !== end) {
            if (this.dictionary[t])
                f = this.dictionary[t];
            else {
                const n = parseInt(t, 10);
                if (isNaN(n)) throw new Error("unknown " + t);
                f = (f: IContext) => f.stack.push(n)
            }

            if (f.parsing)
                f(this);
            else
                this.parseStack.top().push(f);
            t = this.words.shift();
        }

        const p = this.parseStack.pop();
        let delta = 0;
        let i;
        let current: IMark | IWord;
        let adr = new Map<string, number>();

        for (i = 0; i < p.length; i++) {
            current = p[i];
            if (typeof current === "function") continue;
            if (!current.code) {
                delta -= 1;
                adr.set(current.label, i + delta);
            } else {
                delta += current.code.length;
            }

        }

        return p
            .map((current) => {
                if (typeof current === "function") return [current];
                if (!current.code) return [];
                const to = adr.get(current.label);
                return current.code.map(c => {
                    if (typeof c === "string") return this.dictionary[c];
                    const n = isNaN(c) ? to : c;
                    return (f: IContext) => f.stack.push(n);
                });
            })
            .reduce((all, current) => all.concat(current), []);
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
        this.words = source.match(/"[^"]*"|\S+/g);
        this.exec(this.parse());
    }
}

const f = new Forthy();
const sp = ": sq ( x -- 2x ) dup * ; 3 4 * . 5 sq .";
const jmp = "0 5 ?jump 100 . 200 ."
const iff = "100 2 > if 100 . then 200 ."
const p = `
: minTen ( n -- (n>10) ) dup 10 swap >
    if
        pop 10
    then ;
100 minTen .
`;
f.run(p);

console.log(f);