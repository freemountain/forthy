import VM from "./VM";
import dicts from "./dictionaries";
import { parse } from "./parser";

const printVm = (vm: VM) => {
    console.log(`
        program: ${vm.program.join(", ")}
        stack: ${vm.stack.join(", ")}
        instructionPointer: ${vm.instructionPointer}
        halted: ${vm.halted}
        dictionary: ${Object.keys(vm.dictionary).join(", ")}
    `);
}

const program = `
1 .
&two jmp
2323 .
#two
2 .
halt
1 2 = if &a 
`;
const token = parse(program);

const vm = new VM(token, [
    dicts.base(),
    dicts.console()
]);

let error = null;

try {
    vm.run();
} catch (e) {
    error = e;
}

if (error) console.log(`Error: ${error}`);
printVm(vm);
