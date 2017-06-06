import IMark from "./interfaces/IMark";
import IDictionary from "./interfaces/IDictionary";
import IContext from "./interfaces/IContext";
import { parsing, word } from "./utils";

const dictionary: IDictionary = {
    "true": (f: IContext) => f.stack.push(-1),
    "false": (f: IContext) => f.stack.push(0),
    "?jump": (f: IContext) => { // ( should to -- )
        const to = f.stack.pop();
        const should = f.stack.pop();
        if (should !== 0)
            f.returnStack.change(ip => to - 1);
    },
    jump: (f: IContext) => {
        const to = f.stack.pop();
        f.returnStack.change(ip => to);
    },
    not: (f: IContext) => {
        const b = f.stack.pop();
        f.stack.push(b === 0 ? -1 : 0)
    },
    dup: (f: IContext) => f.stack.push(f.stack.top()),
    '*': (f) => f.stack.push(f.stack.pop() * f.stack.pop()),
    '.': (f) => console.log(f.stack.pop()),
    '(': parsing((f: IContext) => {
                console.log("sddsssss");

        while (f.words.shift() !== ')') {
            console.log("sdsdsd", f.words);
        };
        console.log("sdds");
    }),
    ':': parsing((f: IContext) => {
        const name = f.words.shift();
        const quot = f.parse(";");
        f.dictionary[name] = (f: IContext) => f.exec(quot);
    }),
    "if": parsing((f: IContext) => {
        f.returnStack.push(-1);
        const n = f.returnStack.length;

        f.parseStack.top().push({
            label: `${n}IF`,
            code: ["not", NaN, "?jump"]
        })
    }),

    "then": parsing((f: IContext) => {
        const n = f.returnStack.length;
        f.returnStack.pop();

        f.parseStack.top().push({ label: `${n}IF` })
    }),
    "<": word("a b -- (b<a)", (f: IContext) => {
        const b = f.stack.pop();
        const a = f.stack.pop();
        f.stack.push((b < a) ? -1 : 0);
    }),
    ">": word("a b -- (b>a)", (f: IContext) => {
        const b = f.stack.pop();
        const a = f.stack.pop();
        f.stack.push((b > a) ? -1 : 0);
    }),
    "swap": word("a b -- b a", (f: IContext) => {
        const b = f.stack.pop();
        const a = f.stack.pop();
        f.stack.push(a);
        f.stack.push(b);
    }),
    "pop": word("a b -- a", (f: IContext) => {
        const b = f.stack.pop();
    }),
}

export default dictionary;