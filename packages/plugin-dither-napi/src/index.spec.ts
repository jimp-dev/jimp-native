import {
  constructJimpWithOverrides,
  makeComparisonTest,
  testConstants,
} from "../../utils-testing";
import dither from "./";

const plugins = [dither];
const types = [];

const JimpCustom = constructJimpWithOverrides({
  pluginOverrides: plugins,
  typeOverrides: types,
});

describe("plugin-dither-napi", () => {
  describe("dither", () => {
    makeComparisonTest(
      "dither",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.dither16();

        return image;
      },
      0
    );

    makeComparisonTest(
      "(async) dither",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        await new Promise((resolve) => image.dither16(resolve));

        return image;
      },
      0
    );
  });
});
