import {
  constructJimpWithOverrides,
  makeComparisonTest,
  testConstants,
} from "../../utils-testing";
import resize from "./";

const plugins = [resize];
const types = [];

const JimpCustom = constructJimpWithOverrides({
  pluginOverrides: plugins,
  typeOverrides: types,
});

describe("plugin-resize-napi", () => {
  makeComparisonTest(
    `resize auto width`,
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.resize(JimpCustom.AUTO, image.getHeight() * 0.7);

      return image;
    },
    3
  );

  makeComparisonTest(
    `resize auto height`,
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.resize(image.getWidth() * 0.7, JimpCustom.AUTO);

      return image;
    },
    3
  );

  makeComparisonTest(
    `(async) resize no mode param`,
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      await new Promise((resolve) =>
        image.resize(image.getWidth() * 0.7, JimpCustom.AUTO, resolve)
      );

      return image;
    },
    3
  );

  makeComparisonTest(
    `resize invalid mode`,
    JimpCustom,
    "native",
    async (JimpConstructor) => {
      const image = await JimpConstructor.read(testConstants.BASE_TEST);

      image.resize(image.getWidth() * 0.7, JimpCustom.AUTO, "bogus");

      return image;
    },
    3
  );

  it("should catch invalid width", async () => {
    const image = await JimpCustom.read(testConstants.BASE_TEST);

    expect(() => {
      image.resize(0, 200);
    }).toThrow("Width must be greater than zero");
  });

  it("should catch invalid height", async () => {
    const image = await JimpCustom.read(testConstants.BASE_TEST);

    expect(() => {
      image.resize(200, 0);
    }).toThrow("Height must be greater than zero");
  });

  [
    ["nearestNeighbor", 0],
    // Bilinear algo in C++ differs quite a bit in some places on a binary level but looks fine to the eye.
    // TODO: see if there's a way to have it match more closely
    ["bilinearInterpolation", 15],
    ["bicubicInterpolation", 3],
    ["hermiteInterpolation", 3],
    ["bezierInterpolation", 3],
    ["defaultInterpolation", 1],
  ].forEach(([mode, tolerance]: [string, number]) => {
    makeComparisonTest(
      `${mode} resize 2x along X`,
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.resize(image.getWidth() * 2, image.getHeight(), mode);

        return image;
      },
      tolerance
    );

    makeComparisonTest(
      `${mode} resize 0.5x along X`,
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.resize(image.getWidth() * 0.5, image.getHeight(), mode);

        return image;
      },
      tolerance
    );

    makeComparisonTest(
      `${mode} resize 2x along Y`,
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.resize(image.getWidth(), image.getHeight() * 2, mode);

        return image;
      },
      tolerance
    );

    makeComparisonTest(
      `${mode} resize 0.5x along Y`,
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.resize(image.getWidth(), image.getHeight() * 0.5, mode);

        return image;
      },
      tolerance
    );

    makeComparisonTest(
      `${mode} resize 0.5x along XY`,
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.resize(image.getWidth() * 0.5, image.getHeight() * 0.5, mode);

        return image;
      },
      tolerance
    );

    makeComparisonTest(
      `(async) ${mode} resize 2x along XY`,
      JimpCustom,
      "native",
      async (JimpConstructor) => {
        const image = await JimpConstructor.read(testConstants.BASE_TEST);

        image.resize(image.getWidth() * 2, image.getHeight() * 2, mode);

        return image;
      },
      tolerance
    );
  });
});
