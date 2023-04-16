import {
  constructJimpWithOverrides,
  makeComparisonTest,
  testConstants,
} from "../../utils-testing";
import circle from "./";

const plugins = [circle];
const types = [];

const JimpCustom = constructJimpWithOverrides({
  pluginOverrides: plugins,
  typeOverrides: types,
});

describe("plugin-circle-napi", () => {
  makeComparisonTest(
    "simple",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_1);

      image.circle();

      return image;
    }
  );

  makeComparisonTest(
    "radius-50",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_1);

      image.circle({
        x: image.getWidth() / 2,
        y: image.getHeight() / 2,
        radius: 50,
      });

      return image;
    }
  );

  makeComparisonTest(
    "offset",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_1);

      image.circle({
        x: 10,
        y: -40,
        radius: 90,
      });

      return image;
    }
  );

  makeComparisonTest(
    "(async) simple",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_1);

      await new Promise((resolve) => {
        image.circle(resolve);
      });

      return image;
    }
  );

  makeComparisonTest(
    "(async) radius-50",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_1);

      await new Promise((resolve) => {
        image.circle(
          {
            x: image.getWidth() / 2,
            y: image.getHeight() / 2,
            radius: 50,
          },
          resolve
        );
      });

      return image;
    }
  );
});
