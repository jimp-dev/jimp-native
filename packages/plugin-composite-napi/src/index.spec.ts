import Jimp from "jimp";
import {
  constructJimpWithOverrides,
  makeComparisonTest,
  testConstants,
} from "../../utils-testing";
import composite from "./";

const plugins = [composite];
const types = [];

const JimpCustom = constructJimpWithOverrides({
  pluginOverrides: plugins,
  typeOverrides: types,
});

describe("plugin-composite-napi", () => {
  Object.keys(JimpCustom)
    .filter((key) => key.startsWith("BLEND_"))
    .map((key) => JimpCustom[key])
    .forEach((mode) => {
      makeComparisonTest(
        `composite-${mode}-src-1-dst-1`,
        JimpCustom,
        "native",
        async (JimpConstructor) => {
          const target = await JimpConstructor.read(testConstants.IMG_128_1);
          const source = await JimpConstructor.read(testConstants.IMG_128_2);

          target.composite(source, 0, 0, {
            mode,
            opacityDest: 1,
            opacitySource: 1,
          });

          return target;
        }
      );

      makeComparisonTest(
        `composite-${mode}-src-0.5-dst-0.5`,
        JimpCustom,
        "native",
        async (JimpConstructor) => {
          const target = await JimpConstructor.read(testConstants.IMG_128_1);
          const source = await JimpConstructor.read(testConstants.IMG_128_2);

          target.composite(source, 0, 0, {
            mode,
            opacityDest: 0.5,
            opacitySource: 0.5,
          });

          return target;
        }
      );

      // Waiting on merge to fix: https://github.com/jimp-dev/jimp/pull/1226
      // makeComparisonTest(
      //   `composite-${mode}-xy-offset`,
      //   JimpCustom,
      //   "native",
      //   async (JimpConstructor) => {
      //     const target = await JimpConstructor.read(testConstants.IMG_128_1);
      //     const source = await JimpConstructor.read(testConstants.IMG_128_2);

      //     target.composite(source, 32, -32, {
      //       mode,
      //       opacityDest: 1,
      //       opacitySource: 1,
      //     });

      //     return target;
      //   }
      // );
    });

  makeComparisonTest(
    `composite-no-opts`,
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const target = await JimpConstructor.read(testConstants.IMG_128_1);
      const source = await JimpConstructor.read(testConstants.IMG_128_2);

      // eslint-disable-next-line no-useless-call
      target.composite.call(target, source, 32, 32);

      return target;
    }
  );

  makeComparisonTest(
    `(async) composite-no-opts`,
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const target = await JimpConstructor.read(testConstants.IMG_128_1);
      const source = await JimpConstructor.read(testConstants.IMG_128_2);

      await new Promise((resolve) =>
        // eslint-disable-next-line no-useless-call
        target.composite.call(target, source, 32, 32, resolve)
      );

      return target;
    }
  );

  it("should check input img", async () => {
    const target = await JimpCustom.read(testConstants.IMG_128_1);

    await expect(async () => {
      target.composite({ bogus: "bogus" } as unknown as Jimp, 32, 32, {
        opacityDest: 1,
        opacitySource: 1,
        mode: JimpCustom.BLEND_ADD,
      });
    }).rejects.toThrow("sourceImage must be a Jimp image");
  });
});
