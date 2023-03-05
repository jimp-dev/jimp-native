const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const tmpDir = path.join(
  os.tmpdir(),
  `jimp-native-tests-${crypto.randomBytes(4).toString("hex")}`
);

fs.mkdirSync(tmpDir);

// Sometimes an exit signal may cause two different signals to trigger in node. Don't try to remove TMP again.
let alreadyClean = false;

// Listen in on these signals so we're able to clean up if testing is interrupted.
["SIGINT", "SIGHUP", "SIGTERM", "beforeExit", "exit"].forEach((signal) =>
  process.on(signal, cleanExit)
);

/**
 * Removes the TMP folder if needed and exits.
 *
 * @param {Number} exitCode
 */
function cleanExit(exitCode = 0) {
  if (alreadyClean) {
    process.exit(exitCode);
  } else {
    alreadyClean = true;
    fs.rmSync(tmpDir, { recursive: true });
    process.exit(exitCode);
  }
}

module.exports = {
  cleanExit,
  tmpDir,
};
