import {
  constructJimpWithOverrides,
  makeComparisonTest,
  testConstants,
} from "../../utils-testing";
import flip from "./";

const plugins = [flip];
const types = [];

const JimpCustom = constructJimpWithOverrides({
  pluginOverrides: plugins,
  typeOverrides: types,
});

describe("plugin-flip-napi", () => {
  makeComparisonTest(
    "flip x",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.flip(true, false);

      return image;
    },
    0
  );

  makeComparisonTest(
    "(async) flip x",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      await new Promise((resolve) => image.flip(true, false, resolve));

      return image;
    },
    0
  );

  makeComparisonTest(
    "flip y",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.flip(false, true);

      return image;
    },
    0
  );

  makeComparisonTest(
    "flip xy",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.flip(true, true);

      return image;
    },
    0
  );

  makeComparisonTest(
    "flip x uneven",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);
      image.crop(0, 0, image.getWidth() - 33, image.getHeight() - 33);

      image.flip(true, false);

      return image;
    },
    0
  );

  makeComparisonTest(
    "flip y uneven",
    JimpCustom,
    "native uneven",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);
      image.crop(0, 0, image.getWidth() - 33, image.getHeight() - 33);

      image.flip(false, true);

      return image;
    },
    0
  );

  makeComparisonTest(
    "flip xy uneven",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);
      image.crop(0, 0, image.getWidth() - 33, image.getHeight() - 33);

      image.flip(true, true);

      return image;
    },
    0
  );
});
