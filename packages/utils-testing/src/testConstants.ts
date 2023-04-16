import path from "node:path";

const imageRoot = path.join(__dirname, "..", "..", "..", "assets", "testing");

export const testConstants = {
  BASE_TEST: path.join(imageRoot, "base_test.png"),
  IMG_128_1: path.join(imageRoot, "qbist_128_1.png"),
  IMG_128_2: path.join(imageRoot, "qbist_128_2.png"),
  IMG_512_1: path.join(imageRoot, "qbist_512_1.png"),
  IMG_512_2: path.join(imageRoot, "qbist_512_2.png"),
  MASK_1: path.join(imageRoot, "mask_simple.png"),
  MASK_2: path.join(imageRoot, "mask_aliasing.png"),
  AUTOCROP: path.join(imageRoot, "autocrop_test.png"),
} as const;
