import {
  constructJimpWithOverrides,
  makeComparisonTest,
  testConstants,
} from "../../utils-testing";
import blit from "./";

const plugins = [blit];
const types = [];

const JimpCustom = constructJimpWithOverrides({
  pluginOverrides: plugins,
  typeOverrides: types,
});

describe("plugin-blit-napi", () => {
  makeComparisonTest(
    "simple positive offsets",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const source = await JimpConstructor.read(testConstants.BASE_TEST);
      const target = await JimpConstructor.read(testConstants.IMG_512_1);

      target.blit(source, target.getWidth() / 2, target.getHeight() / 2);

      return target;
    },
    0
  );

  makeComparisonTest(
    "simple negative offsets",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const source = await JimpConstructor.read(testConstants.BASE_TEST);
      const target = await JimpConstructor.read(testConstants.IMG_512_1);

      target.blit(source, -(target.getWidth() / 2), -(target.getHeight() / 2));

      return target;
    },
    0
  );

  makeComparisonTest(
    "simple with transparency",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const source = await JimpConstructor.read(testConstants.BASE_TEST);
      const target = await JimpConstructor.read(testConstants.IMG_512_1);

      source.opacity(0.4);
      target.opacity(0.4);

      target.blit(source, target.getWidth() / 2, target.getHeight() / 2);

      return target;
    },
    0
  );

  makeComparisonTest(
    "with source cutoffs",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const source = await JimpConstructor.read(testConstants.BASE_TEST);
      const target = await JimpConstructor.read(testConstants.IMG_512_1);

      target.blit(
        source,
        target.getWidth() / 2,
        target.getHeight() / 2,
        50,
        50,
        50,
        50
      );

      return target;
    },
    0
  );

  makeComparisonTest(
    "(async) with source cutoffs",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const source = await JimpConstructor.read(testConstants.BASE_TEST);
      const target = await JimpConstructor.read(testConstants.IMG_512_1);

      await new Promise((resolve) => {
        target.blit(
          source,
          target.getWidth() / 2,
          target.getHeight() / 2,
          50,
          50,
          50,
          50,
          resolve
        );
      });

      return target;
    },
    0
  );

  makeComparisonTest(
    "(async) without source cutoffs",
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const source = await JimpConstructor.read(testConstants.BASE_TEST);
      const target = await JimpConstructor.read(testConstants.IMG_512_1);

      await new Promise((resolve) => {
        target.blit(
          source,
          target.getWidth() / 2,
          target.getHeight() / 2,
          resolve
        );
      });

      return target;
    },
    0
  );

  it("should not allow passing non-jimp objects", async () => {
    const target = await JimpCustom.read(testConstants.BASE_TEST);

    expect(() => {
      // eslint-disable-next-line no-useless-call
      target.blit.call(target, { bogus: "yes" }, 0, 0);
    }).toThrowError("sourceImage must be a Jimp image");
  });
});
