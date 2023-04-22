import {
  constructJimpWithOverrides,
  makeComparisonTest,
  testConstants,
} from "../../utils-testing";
import crop from "./";

const plugins = [crop];
const types = [];

const JimpCustom = constructJimpWithOverrides({
  pluginOverrides: plugins,
  typeOverrides: types,
});

describe("plugin-crop-napi", () => {
  describe("crop", () => {
    makeComparisonTest(
      "1px border",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.crop(1, 1, image.getWidth() - 2, image.getHeight() - 2);

        return image;
      },
      0
    );

    makeComparisonTest(
      "50px border",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.crop(50, 50, image.getWidth() - 100, image.getHeight() - 100);

        return image;
      },
      0
    );

    makeComparisonTest(
      "js buffer resize shortcut",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.crop(0, 0, image.getWidth() - 0, image.getHeight() - 100);

        return image;
      },
      0
    );

    makeComparisonTest(
      "(async) js buffer resize shortcut",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        await new Promise((resolve) =>
          image.crop(
            0,
            0,
            image.getWidth() - 0,
            image.getHeight() - 100,
            resolve
          )
        );

        return image;
      },
      0
    );

    makeComparisonTest(
      "(async) 50px border",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        await new Promise((resolve) =>
          image.crop(
            50,
            50,
            image.getWidth() - 100,
            image.getHeight() - 100,
            resolve
          )
        );

        return image;
      },
      0
    );
  });

  describe("autocrop", () => {
    makeComparisonTest(
      "autocrop simple",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.AUTOCROP);

        image.autocrop();

        return image;
      }
    );

    makeComparisonTest(
      "(async) autocrop simple",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.AUTOCROP);

        // eslint-disable-next-line no-useless-call
        await new Promise((resolve) => image.autocrop.call(image, resolve));

        return image;
      }
    );

    makeComparisonTest(
      "autocrop no tolerance",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.AUTOCROP);

        image.autocrop({ tolerance: 0 });

        return image;
      }
    );

    makeComparisonTest(
      "autocrop symmetry",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.AUTOCROP);

        image.autocrop({ cropSymmetric: true });

        return image;
      }
    );

    makeComparisonTest(
      "autocrop leave border",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.AUTOCROP);

        image.autocrop({ leaveBorder: 1 });

        return image;
      }
    );

    makeComparisonTest(
      "autocrop no north",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.AUTOCROP);

        image.autocrop({
          cropOnlyFrames: false,
          ignoreSides: { north: true, south: false, east: false, west: false },
        });

        return image;
      }
    );

    // Waiting on merge to fix: https://github.com/jimp-dev/jimp/pull/1227
    // makeComparisonTest(
    //   "autocrop no west",
    //   JimpCustom,
    //   "native",
    //   async (JimpConstructor) => {
    //     const image = await JimpConstructor.read(testConstants.AUTOCROP);

    //     image.autocrop({
    //       ignoreSides: { north: false, south: false, east: false, west: true },
    //       cropOnlyFrames: false,
    //     });

    //     return image;
    //   }
    // );

    // Waiting on merge to fix: https://github.com/jimp-dev/jimp/pull/1227
    // makeComparisonTest(
    //   "autocrop no east",
    //   JimpCustom,
    //   "native",
    //   async (JimpConstructor) => {
    //     const image = await JimpConstructor.read(testConstants.AUTOCROP);

    //     image.autocrop({
    //       ignoreSides: { north: false, south: false, east: true, west: false },
    //       cropOnlyFrames: false,
    //     });

    //     return image;
    //   }
    // );

    makeComparisonTest(
      "autocrop no south",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.AUTOCROP);

        image.autocrop({
          ignoreSides: { north: false, south: true, east: false, west: false },
          cropOnlyFrames: false,
        });

        return image;
      }
    );

    makeComparisonTest(
      "autocrop tolerance in first arg",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.AUTOCROP);

        image.autocrop(0.3);

        return image;
      }
    );

    makeComparisonTest(
      "(async) autocrop tolerance in first arg",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.AUTOCROP);

        await new Promise((resolve) => image.autocrop(0.3, resolve));

        return image;
      }
    );

    makeComparisonTest(
      "autocrop crop only frames as first arg",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.AUTOCROP);

        image.autocrop(true);

        return image;
      }
    );

    makeComparisonTest(
      "autocrop crop only frames as second arg",
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.AUTOCROP);

        image.autocrop(0.3, true);

        return image;
      }
    );
  });
});
