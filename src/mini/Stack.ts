export default class Stack<T> {
    private data: Array<T>;

    constructor() {
        this.data = [];
    }

    public get length() {
        return this.data.length;
    }

    public pop(): T {
        if(this.length === 0) throw new Error("stack underflow");
        return this.data.pop();
    }

    public push(t: T) {
        return this.data.push(t);
    }

    public top(d: number = 1): T {
        return this.data[this.data.length - d];
    }

    public change(f: (t: T)=> T, d: number = 1) {
        const position = this.data.length - d;
        this.data[position] = f(this.data[position]);
    }
}