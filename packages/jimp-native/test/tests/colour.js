const testConstants = require("../test-constants");
const { PHASE_TYPES } = testConstants;

module.exports = {
  name: "colour",
  phases: [
    {
      name: "brightness-darken",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.brightness(-0.3);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "brightness-brighten",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.brightness(0.3);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "opacity-fully-transparent",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.opacity(0);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "opacity-fully-opaque",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.opacity(1);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "opacity-half-transparent",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.opacity(0.5);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "contrast-lower",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.contrast(-0.3);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "contrast-higher",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.contrast(0.3);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "posterize-3",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.posterize(3);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "posterize-3.5",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.posterize(3.5);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "posterize-5",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.posterize(5);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "sepia",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.sepia();
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "convolution-sharpen",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.convolution([
          [0, -1, 0],
          [-1, 5, -1],
          [0, -1, 0],
        ]);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "convolution-edge-detect",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.convolution([
          [-1, -1, -1],
          [-1, 8, -1],
          [-1, -1, -1],
        ]);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "convolution-gaussian-blur-edge-extend",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.convolution(
          [
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
          ],
          testConstants.JimpConstants.EDGE_EXTEND
        );
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "convolution-gaussian-blur-edge-wrap",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.convolution(
          [
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
          ],
          testConstants.JimpConstants.EDGE_WRAP
        );
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "convolution-gaussian-blur-edge-crop",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.convolution(
          [
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
          ],
          testConstants.JimpConstants.EDGE_CROP
        );
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "opaque",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.opacity(0.5);
        image.opaque();

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "fade",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.fade(0.3);

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "greyscale",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.greyscale();

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "greyscale",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.greyscale();

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "convolute-gaussian-blur-half-image",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.convolute(
          [
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
          ],
          0,
          0,
          image.getWidth() / 2,
          image.getHeight()
        );
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "convolute-gaussian-blur-centre-image",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.convolute(
          [
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
          ],
          image.getWidth() / 4,
          image.getHeight() / 4,
          image.getWidth() / 2,
          image.getHeight() / 2
        );
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "pixelate",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.pixelate(10);
        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "pixelate-centre",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);
        image.pixelate(
          10,
          image.getWidth() / 4,
          image.getHeight() / 4,
          image.getWidth() / 2,
          image.getHeight() / 2
        );
        await imageStore.store(storageKey, image);
      },
    },
  ],
};
