const fs = require("fs");
const path = require("path");

const tests = [];

// Load all tests.
for (const testFile of fs.readdirSync(path.join(__dirname))) {
  if (
    testFile.endsWith(".js") &&
    testFile !== path.basename(__filename) &&
    !testFile.includes("disabled")
  ) {
    const test = require(path.join(__dirname, testFile));
    if (!test.name) {
      throw new Error(`Test in ${testFile} is missing property: name.`);
    }

    if (typeof test.name !== "string") {
      throw new Error(`Name property in ${testFile} is not of type string.`);
    }

    test.name = test.name.replace(/-/g, "_");

    if (!test.phases) {
      throw new Error(`Test in ${testFile} is missing property: phases.`);
    }

    if (!Array.isArray(test.phases)) {
      throw new Error(`Phases property in ${testFile} is not an array.`);
    }

    for (const phase of test.phases) {
      if (!phase.name || typeof phase.name !== "string") {
        throw new Error(
          `One or more test phases in ${testFile} is missing a name.`
        );
      }

      if (typeof phase.type !== "number") {
        throw new Error(
          `One or more test phases in ${testFile} is missing a phase type property.`
        );
      }

      if (
        !phase.run ||
        typeof phase.run !== "function" ||
        phase.run.constructor.name !== "AsyncFunction"
      ) {
        throw new Error(
          `One or more test phases in ${testFile} has no async run function.`
        );
      }
    }

    tests.push(test);
  }
}

module.exports = tests;
