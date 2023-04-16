import {
  constructJimpWithOverrides,
  makeComparisonTest,
  testConstants,
} from "../../utils-testing";
import blur from "./";

const plugins = [blur];
const types = [];

const JimpCustom = constructJimpWithOverrides({
  pluginOverrides: plugins,
  typeOverrides: types,
});

describe("plugin-blur-napi", () => {
  makeComparisonTest(
    "blur radius 1",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_1);

      image.blur(1);

      return image;
    },
    3
  );

  makeComparisonTest(
    "blur radius 2",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_1);

      image.blur(2);

      return image;
    },
    3
  );

  makeComparisonTest(
    "blur radius 10",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_1);

      image.blur(10);

      return image;
    },
    3
  );

  makeComparisonTest(
    "blur radius 100",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_1);

      image.blur(100);

      return image;
    },
    3
  );

  makeComparisonTest(
    "(async) blur radius 10",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_1);

      await new Promise((resolve) => {
        image.blur(10, resolve);
      });

      return image;
    },
    3
  );
});
