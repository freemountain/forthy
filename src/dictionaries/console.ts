import IDictionary from "./../interfaces/IDictionary";
import IContext from "./../interfaces/IContext";

export default (): IDictionary => ({
    ".": [(ctx: IContext) => {
        const n = ctx.popStack();
        console.log(n);
    }],
    "emit": [(ctx: IContext) => {
        const n = ctx.popStack();
        console.log(String.fromCharCode(n));
    }],
});