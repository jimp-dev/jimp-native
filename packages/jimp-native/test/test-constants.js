const constants = require("../lib/constants");
const path = require("path");

module.exports = {
  ...constants,
  IMG1: path.join(__dirname, "assets", "images", "base_test.png"),
  IMG2: path.join(__dirname, "assets", "images", "qbist_128_1.png"),
  IMG3: path.join(__dirname, "assets", "images", "qbist_128_2.png"),
  IMG4: path.join(__dirname, "assets", "images", "qbist_512_1.png"),
  IMG5: path.join(__dirname, "assets", "images", "qbist_512_2.png"),
  MASK_1: path.join(__dirname, "assets", "images", "mask_simple.png"),
  MASK_2: path.join(__dirname, "assets", "images", "mask_aliasing.png"),
  AUTOCROP: path.join(__dirname, "assets", "images", "autocrop_test.png"),

  // Output storage folder, for visual inspection purposes.
  VISUAL_OUT_DIR: path.join(__dirname, "visual-output"),

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
