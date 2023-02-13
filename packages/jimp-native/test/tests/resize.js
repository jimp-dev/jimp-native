const testConstants = require("../test-constants");
const { PHASE_TYPES } = testConstants;

module.exports = {
  name: "resize",
  tolerance: 2,
  phases: [
    {
      name: "nearest-neighbour-2x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 2,
          image.getHeight() * 2,
          "nearestNeighbor"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "nearest-neighbour-0.5x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 0.5,
          image.getHeight() * 0.5,
          "nearestNeighbor"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "bilinear-3x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 3,
          image.getHeight() * 3,
          "bilinearInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "bilinear-varied-aspect",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 2,
          image.getHeight() * 3,
          "bilinearInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "bilinear-2x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 2,
          image.getHeight() * 2,
          "bilinearInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "bilinear-0.5x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 0.5,
          image.getHeight() * 0.5,
          "bilinearInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "bicubic-3x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 3,
          image.getHeight() * 3,
          "bicubicInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "bicubic-varied-aspect",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 2,
          image.getHeight(),
          "bicubicInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "bicubic-2x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG3);

        image.resize(
          image.getWidth() * 2,
          image.getHeight() * 2,
          "bicubicInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "bicubic-0.5x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 0.5,
          image.getHeight() * 0.5,
          "bicubicInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "hermite-3x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 3,
          image.getHeight() * 3,
          "hermiteInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "hermite-varied-aspect",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 2,
          image.getHeight(),
          "hermiteInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "hermite-2x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG3);

        image.resize(
          image.getWidth() * 2,
          image.getHeight() * 2,
          "hermiteInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "hermite-0.5x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 0.5,
          image.getHeight() * 0.5,
          "hermiteInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "bezier-3x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 3,
          image.getHeight() * 3,
          "bezierInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "bezier-varied-aspect",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 2,
          image.getHeight(),
          "bezierInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "bezier-2x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG3);

        image.resize(
          image.getWidth() * 2,
          image.getHeight() * 2,
          "bezierInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "bezier-0.5x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(
          image.getWidth() * 0.5,
          image.getHeight() * 0.5,
          "bezierInterpolation"
        );

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "default-3x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(image.getWidth() * 3, image.getHeight() * 3);

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "default-width-only",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(image.getWidth() * 2, image.getHeight());

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "default-height-only",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(image.getWidth(), image.getHeight() * 2);

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "default-do-nothing",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(image.getWidth(), image.getHeight());

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "default-2x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG3);

        image.resize(image.getWidth() * 2, image.getHeight() * 2);

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "default-0.5x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(image.getWidth() * 0.5, image.getHeight() * 0.5);

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "default-0.5x-width",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(image.getWidth() * 0.5, image.getHeight());

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "default-0.7x-width",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(image.getWidth() * 0.7, image.getHeight());

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "default-0.7x-height",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(image.getWidth(), image.getHeight() * 0.7);

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "default-0.7x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(image.getWidth() * 0.7, image.getHeight() * 0.7);

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "default-0.3x",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.resize(image.getWidth() * 0.3, image.getHeight() * 0.3);

        await imageStore.store(storageKey, image);
      },
    },
  ],
};
