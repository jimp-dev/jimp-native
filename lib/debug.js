const debugOn = typeof process.env.JIMP_NATIVE_TEST !== "undefined";

const noOp = () => {};
let chalk = null;

/**
 * Simply returns the given function if debug mode is on. Returns a no-op if debug is off.
 *
 * @param {Function} func
 */
function defineDebugFn(func) {
  if (debugOn) {
    return func;
  }

  return noOp;
}

exports.log = defineDebugFn((msg) => {
  if (chalk) {
    console.log(`(${chalk.grey("debug")}) ${chalk.blue(msg)}`);
  } else {
    console.log(`[DEBUG] ${msg}`);
  }
});

exports.isDebugOn = () => {
  return debugOn;
};

if (debugOn) {
  try {
    chalk = require("chalk");
  } catch (err) {
    exports.log("Chalk not available. Coloured debug logs will be disabled.");
  }
}
