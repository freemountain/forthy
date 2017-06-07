import IContext from "./IContext";

interface IWord {
    (f: IContext): void;
    parsing?: boolean;
};

export default IWord;