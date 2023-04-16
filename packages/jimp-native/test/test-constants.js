const Jimp = require("jimp");
const constants = require("@jimp/core/dist/constants");
const path = require("path");

const imageRoot = path.join(__dirname, "..", "..", "..", "assets", "testing");

module.exports = {
  ...constants,
  IMG1: path.join(imageRoot, "base_test.png"),
  IMG2: path.join(imageRoot, "qbist_128_1.png"),
  IMG3: path.join(imageRoot, "qbist_128_2.png"),
  IMG4: path.join(imageRoot, "qbist_512_1.png"),
  IMG5: path.join(imageRoot, "qbist_512_2.png"),
  MASK_1: path.join(imageRoot, "mask_simple.png"),
  MASK_2: path.join(imageRoot, "mask_aliasing.png"),
  AUTOCROP: path.join(imageRoot, "autocrop_test.png"),

  // Output storage folder, for visual inspection purposes.
  VISUAL_OUT_DIR: path.join(__dirname, "visual-output"),

  BLEND_MODE_MAP: Object.getOwnPropertyNames(Jimp)
    .filter((k) => k.startsWith("BLEND_"))
    .reduce((result, k, idx) => ({ ...result, [Jimp[k]]: idx }), {}),

  /*
    Amount of difference allowed between two colour components (0 - 255). This is to account for small arithmetic 
    variances and floating point number calculations.
    */
  COLOUR_TOLERANCE: 1,

  PHASE_TYPES: {
    COMPARISON: 0,
    NO_THROW: 1,
  },
};
