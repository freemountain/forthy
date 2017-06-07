require('source-map-support').install();

const fs = require("fs");
const Forthy = require("./build/Forthy").default;

const program = fs.readFileSync(process.argv[2], "utf8");
const ctx = new Forthy();

ctx.run(program);

console.log(ctx);
