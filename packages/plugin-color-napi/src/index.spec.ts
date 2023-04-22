import { EdgeHandling } from "@jimp-native/utils-ts";
import {
  constructJimpWithOverrides,
  makeComparisonTest,
  testConstants,
} from "../../utils-testing";
import color from "./";

const GAUSSIAN_BLUR_KERNEL = [
  [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
  [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
  [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
  [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
  [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
];

const plugins = [color];
const types = [];

const JimpCustom = constructJimpWithOverrides({
  pluginOverrides: plugins,
  typeOverrides: types,
});

describe("plugin-color-napi", () => {
  describe("greyscale", () => {
    makeComparisonTest(
      "greyscale",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.greyscale();

        return image;
      }
    );

    makeComparisonTest(
      "(async) greyscale",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        await new Promise((resolve) => image.greyscale(resolve));

        return image;
      }
    );
  });

  describe("brightness", () => {
    makeComparisonTest(
      "brightness darken",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.brightness(-0.3);

        return image;
      }
    );

    makeComparisonTest(
      "brightness brighten",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.brightness(0.3);

        return image;
      }
    );

    it("should catch brightness > 1", async () => {
      const image = await JimpCustom.read(testConstants.IMG_128_1);

      expect(() => {
        image.brightness(3);
      }).toThrow("Brightness has to be in the range of -1 to 1");
    });

    it("should catch brightness < 0", async () => {
      const image = await JimpCustom.read(testConstants.IMG_128_1);

      expect(() => {
        image.brightness(-4);
      }).toThrow("Brightness has to be in the range of -1 to 1");
    });

    makeComparisonTest(
      "(async) brightness darken",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        await new Promise((resolve) => image.brightness(-0.3, resolve));

        return image;
      }
    );
  });

  describe("opacity", () => {
    makeComparisonTest(
      "opacity 0",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.opacity(0);

        return image;
      }
    );

    makeComparisonTest(
      "opacity 1",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.opacity(1);

        return image;
      }
    );

    makeComparisonTest(
      "opacity 0.5",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.opacity(0.5);

        return image;
      }
    );

    makeComparisonTest(
      "fade 0.3",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.fade(0.3);

        return image;
      }
    );

    makeComparisonTest(
      "(async) opacity 0.5",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        await new Promise((resolve) => image.opacity(0.5, resolve));

        return image;
      }
    );

    it("should catch opacity > 1", async () => {
      const image = await JimpCustom.read(testConstants.IMG_128_1);

      expect(() => {
        image.opacity(3);
      }).toThrow("Opacity has to be in the range from 0 to 1");
    });

    it("should catch opacity < 0", async () => {
      const image = await JimpCustom.read(testConstants.IMG_128_1);

      expect(() => {
        image.opacity(-0.5);
      }).toThrow("Opacity has to be in the range from 0 to 1");
    });
  });

  describe("contrast", () => {
    makeComparisonTest(
      "lower contrast",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.contrast(-0.3);

        return image;
      }
    );

    makeComparisonTest(
      "higher contrast",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.contrast(0.3);

        return image;
      }
    );

    makeComparisonTest(
      "(async) higher contrast",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        await new Promise((resolve) => image.contrast(0.3, resolve));

        return image;
      }
    );

    it("should catch contrast > 1", async () => {
      const image = await JimpCustom.read(testConstants.IMG_128_1);

      expect(() => {
        image.contrast(3);
      }).toThrow("Contrast has to be in the range from -1 to 1");
    });

    it("should catch contrast < -1", async () => {
      const image = await JimpCustom.read(testConstants.IMG_128_1);

      expect(() => {
        image.contrast(-1.5);
      }).toThrow("Contrast has to be in the range from -1 to 1");
    });
  });

  describe("posterize", () => {
    makeComparisonTest(
      "posterize 3",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.posterize(3);

        return image;
      }
    );

    makeComparisonTest(
      "posterize 5",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.posterize(5);

        return image;
      }
    );

    makeComparisonTest(
      "posterize -1",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.posterize(-1);

        return image;
      }
    );

    makeComparisonTest(
      "(async) posterize 5",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        await new Promise((resolve) => image.posterize(5, resolve));

        return image;
      }
    );
  });

  describe("sepia", () => {
    makeComparisonTest(
      "sepia",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.sepia();

        return image;
      }
    );

    makeComparisonTest(
      "(async) sepia",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        await new Promise((resolve) => image.sepia(resolve));

        return image;
      }
    );
  });

  describe("opaque", () => {
    makeComparisonTest(
      "opaque",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.opaque();

        return image;
      }
    );

    makeComparisonTest(
      "(async) opaque",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        await new Promise((resolve) => image.opaque(resolve));

        return image;
      }
    );
  });

  describe("convolution", () => {
    makeComparisonTest(
      "convolution gaussian blur",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.convolution(GAUSSIAN_BLUR_KERNEL);

        return image;
      }
    );

    makeComparisonTest(
      "convolution gaussian blur edge wrap",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.convolution(GAUSSIAN_BLUR_KERNEL, EdgeHandling.EDGE_WRAP);

        return image;
      }
    );

    makeComparisonTest(
      "convolution gaussian blur edge crop",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.convolution(GAUSSIAN_BLUR_KERNEL, EdgeHandling.EDGE_CROP);

        return image;
      }
    );

    makeComparisonTest(
      "(async) convolution gaussian blur",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        await new Promise((resolve) =>
          image.convolution(GAUSSIAN_BLUR_KERNEL, resolve)
        );

        return image;
      }
    );

    makeComparisonTest(
      "(async) convolution gaussian blur edge wrap",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        await new Promise((resolve) =>
          image.convolution(
            GAUSSIAN_BLUR_KERNEL,
            EdgeHandling.EDGE_WRAP,
            resolve
          )
        );

        return image;
      }
    );

    it("should validate kernel", async () => {
      const image = await JimpCustom.read(testConstants.IMG_128_1);

      expect(() => {
        image.convolution([["bogus" as unknown as number]]);
      }).toThrow("Kernel must be a 2D array of numbers");
    });
  });

  describe("convolute", () => {
    // Waiting on merge to fix: https://github.com/jimp-dev/jimp/pull/1228
    // makeComparisonTest(
    //   "convolute gaussian blur",
    //   JimpCustom,
    //   "native",
    //   async (JimpConstructor) => {
    //     const image = await JimpConstructor.read(testConstants.BASE_TEST);

    //     image.convolute(GAUSSIAN_BLUR_KERNEL);

    //     return image;
    //   }
    // );

    makeComparisonTest(
      "convolute gaussian blur offset and 50 by 50",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.IMG_128_1);

        image.convolute(GAUSSIAN_BLUR_KERNEL, 50, 50, 50, 50);

        return image;
      }
    );

    // Waiting on merge to fix: https://github.com/jimp-dev/jimp/pull/1228
    // makeComparisonTest(
    //   "(async) convolute gaussian blur",
    //   JimpCustom,
    //   "native",
    //   async (JimpConstructor) => {
    //     const image = await JimpConstructor.read(testConstants.BASE_TEST);

    //     await new Promise((resolve) =>
    //       image.convolute(GAUSSIAN_BLUR_KERNEL, resolve)
    //     );

    //     return image;
    //   }
    // );

    makeComparisonTest(
      "(async) convolute gaussian blur offset and 50 by 50",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        await new Promise((resolve) =>
          image.convolute(GAUSSIAN_BLUR_KERNEL, 50, 50, 50, 50, resolve)
        );

        return image;
      }
    );

    it("should validate kernel", async () => {
      const image = await JimpCustom.read(testConstants.IMG_128_1);

      expect(() => {
        image.convolute([["bogus" as unknown as number]]);
      }).toThrow("Kernel must be a 2D array of numbers");
    });
  });

  describe("pixelate", () => {
    makeComparisonTest(
      "pixelate 10",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.pixelate(10);

        return image;
      }
    );

    makeComparisonTest(
      "pixelate centre",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.pixelate(
          10,
          image.getWidth() / 4,
          image.getHeight() / 4,
          image.getWidth() / 2,
          image.getHeight() / 2
        );

        return image;
      }
    );

    makeComparisonTest(
      "(async) pixelate centre",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        await new Promise((resolve) =>
          image.pixelate(
            10,
            image.getWidth() / 4,
            image.getHeight() / 4,
            image.getWidth() / 2,
            image.getHeight() / 2,
            resolve
          )
        );

        return image;
      }
    );

    makeComparisonTest(
      "(async) pixelate 10",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        await new Promise((resolve) => image.pixelate(10, resolve));

        return image;
      }
    );
  });
});
