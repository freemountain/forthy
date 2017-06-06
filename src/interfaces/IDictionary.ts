import IContext from "./IContext";

interface IDictionary {
    [name: string]: Array<((ctx: IContext) => void)| string>
};

export default IDictionary;