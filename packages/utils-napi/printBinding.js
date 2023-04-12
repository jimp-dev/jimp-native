const fs = require("fs");
const path = require("path");

console.log(fs.readFileSync(path.join(__dirname, "binding.gypi"), "utf8"));
