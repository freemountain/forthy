import IWord from "./interfaces/IWord";
import IContext from "./interfaces/IContext";
import IMark from "./interfaces/IMark";
import IDictionary from "./interfaces/IDictionary";

export const parsing = (f: IWord): IWord => Object.assign(f, {
    parsing: true,
})

export const word = (effect: string, f: (f: IContext) => void): IWord => Object.assign(f, {
    parsing: false,
    effect
});

export const reduceMarks = (input: Array<IWord | IMark>, dictionary: IDictionary): IWord[] => {
    let delta = 0;
    let i;
    let current: IMark | IWord;
    let adr = new Map<string, number>();

    for (i = 0; i < input.length; i++) {
        current = input[i];
        if (typeof current === "function") continue;
        if (!current.code) {
            delta -= 1;
            adr.set(current.label, i + delta);
        } else {
            delta += current.code.length;
        }

    }

    return input
        .map((current) => {
            if (typeof current === "function") return [current];
            if (!current.code) return [];
            const to = adr.get(current.label);
            return current.code.map(c => {
                if (typeof c === "string") return dictionary[c];
                const n = isNaN(c) ? to : c;
                return (f: IContext) => f.stack.push(n);
            });
        })
        .reduce((all, current) => all.concat(current), []);
}