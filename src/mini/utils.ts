import IWord from "./interfaces/IWord";
import IContext from "./interfaces/IContext";

export const parsing = (f: IWord): IWord => Object.assign(f, {
    parsing: true,
})

export const word = (effect: string, f: (f: IContext) => void): IWord => Object.assign(f, {
    parsing: false,
    effect
});
