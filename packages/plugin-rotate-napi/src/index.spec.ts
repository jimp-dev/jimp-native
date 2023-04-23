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

describe("plugin-rotate-napi", () => {
  makeComparisonTest(
    "rotate 45 degrees",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.rotate(45);

      return image;
    },
    0
  );

  makeComparisonTest(
    "(async) rotate 45 degrees",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      await new Promise((resolve) => image.rotate(45, resolve));

      return image;
    },
    0
  );

  makeComparisonTest(
    "rotate -45 degrees",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.rotate(-45);

      return image;
    },
    0
  );

  makeComparisonTest(
    "rotate 90 degrees",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.rotate(90);

      return image;
    },
    0
  );

  makeComparisonTest(
    "(async) rotate 90 degrees",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      await new Promise((resolve) => image.rotate(90, resolve));

      return image;
    },
    0
  );

  makeComparisonTest(
    "rotate 180 degrees",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.rotate(180);

      return image;
    },
    0
  );

  makeComparisonTest(
    "rotate 270 degrees",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.rotate(270);

      return image;
    },
    0
  );

  makeComparisonTest(
    "rotate -90 degrees",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.rotate(-90);

      return image;
    },
    0
  );

  makeComparisonTest(
    "rotate -180 degrees",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.rotate(-180);

      return image;
    },
    0
  );

  makeComparisonTest(
    "rotate 360 degrees",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.rotate(360);

      return image;
    },
    0
  );

  makeComparisonTest(
    "(async) rotate 0 degrees",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      await new Promise((resolve) => image.rotate(0, resolve));

      return image;
    },
    0
  );

  makeComparisonTest(
    "rotate 45 degrees no resize",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.rotate(45, false);

      return image;
    },
    0
  );

  makeComparisonTest(
    "rotate 50 degrees uneven",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.crop(0, 0, 51, 51);
      image.rotate(50);

      return image;
    },
    0
  );

  makeComparisonTest(
    "(async) rotate 45 degrees no resize",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      await new Promise((resolve) => image.rotate(45, false, resolve));

      return image;
    },
    0
  );

  it("should catch invalid mode types", async () => {
    const image = await JimpCustom.read(testConstants.BASE_TEST);

    expect(() => {
      // eslint-disable-next-line no-useless-call
      image.rotate.call(image, 30, {});
    }).toThrow("Resize must be of type Boolean or String");
  });

  // Waiting on merge to fix: https://github.com/jimp-dev/jimp/pull/1229
  // makeComparisonTest(
  //   "rotate 90 degrees no resize",
  //   JimpCustom,
  //   "native",
  //   async (JimpConstructor) => {
  //     const image = await JimpConstructor.read(testConstants.BASE_TEST);

  //     image.rotate(90, false);

  //     return image;
  //   },
  //   0
  // );
});
