const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const writeFile = promisify(fs.writeFile);

/**
 * Handles storage of test output.
 */
class ImageStore {
  constructor(tmpPath, visualPath) {
    this.tmpPath = tmpPath;
    this.visualPath = visualPath;

    for (const entry of fs.readdirSync(visualPath)) {
      if (entry !== ".gitkeep") {
        fs.rmSync(path.join(visualPath, entry), { recursive: true });
      }
    }
  }

  store(storageKey, jimpImage) {
    const keyComponents = storageKey.split("-");
    const testName = keyComponents.shift();
    const testPhase = keyComponents.join("-");
    const visualPathSub = path.join(this.visualPath, testName);

    if (
      jimpImage.bitmap.data.length >
      jimpImage.bitmap.width * jimpImage.bitmap.height * 4
    ) {
      console.warn(
        `Buffer is larger than expected for ${storageKey}, cutting to size.\n`
      );
      jimpImage.bitmap.data = jimpImage.bitmap.data.slice(
        0,
        jimpImage.bitmap.width * jimpImage.bitmap.height * 4
      );
    }

    return Promise.all([
      writeFile(
        path.join(this.tmpPath, `${storageKey}.bin`),
        jimpImage.bitmap.data
      ),
      ensureFolderExists(visualPathSub).then(() => {
        return jimpImage.write(path.join(visualPathSub, `${testPhase}.png`));
      }),
    ]);
  }
}

function ensureFolderExists(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if (!err || err.code === "EEXIST") {
        resolve();
      } else {
        reject(err);
      }
    });
  });
}

module.exports = ImageStore;
