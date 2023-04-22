import {
  constructJimpWithOverrides,
  makeComparisonTest,
  testConstants,
} from "../../utils-testing";
import invert from "./";

const plugins = [invert];
const types = [];

const JimpCustom = constructJimpWithOverrides({
  pluginOverrides: plugins,
  typeOverrides: types,
});

describe("plugin-invert-napi", () => {
  makeComparisonTest(
    "invert",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.invert();

      return image;
    },
    0
  );

  makeComparisonTest(
    "(async) invert",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      await new Promise((resolve) => image.invert(resolve));

      return image;
    },
    0
  );
});
