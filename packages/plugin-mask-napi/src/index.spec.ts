import {
  constructJimpWithOverrides,
  makeComparisonTest,
  testConstants,
} from "../../utils-testing";
import mask from "./";

const plugins = [mask];
const types = [];

const JimpCustom = constructJimpWithOverrides({
  pluginOverrides: plugins,
  typeOverrides: types,
});

describe("plugin-mask-napi", () => {
  makeComparisonTest(
    "simple mask",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_2);
      const mask = await JimpConstructor.read(testConstants.MASK_1);

      image.mask(mask, 0, 0);

      return image;
    },
    0
  );

  makeComparisonTest(
    "(async) simple mask",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_2);
      const mask = await JimpConstructor.read(testConstants.MASK_1);

      await new Promise((resolve) => image.mask(mask, 0, 0, resolve));

      return image;
    },
    0
  );

  makeComparisonTest(
    "mask with positive offsets",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_2);
      const mask = await JimpConstructor.read(testConstants.MASK_1);

      image.mask(mask, 50, 80);

      return image;
    },
    0
  );

  makeComparisonTest(
    "mask with negative offsets",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_2);
      const mask = await JimpConstructor.read(testConstants.MASK_1);

      image.mask(mask, -50, -80);

      return image;
    },
    0
  );

  makeComparisonTest(
    "mask with aliasing",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.IMG_128_2);
      const mask = await JimpConstructor.read(testConstants.MASK_2);

      image.mask(mask, 0, 0);

      return image;
    },
    0
  );

  it("should catch invalid source image", async () => {
    const image = await JimpCustom.read(testConstants.IMG_128_2);

    expect(() => {
      image.mask({ bogus: true } as any, 0, 0);
    }).toThrow("sourceImage must be a Jimp image");
  });
});
