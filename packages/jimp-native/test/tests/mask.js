const testConstants = require("../test-constants");
const { PHASE_TYPES } = testConstants;

module.exports = {
  name: "mask",
  phases: [
    {
      name: "simple",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG2);
        const mask = await JimpConstructor.read(testConstants.MASK_1);

        image.mask(mask);

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "positive-offsets",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG2);
        const mask = await JimpConstructor.read(testConstants.MASK_1);

        image.mask(mask, 50, 80);

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "negative-offsets",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG2);
        const mask = await JimpConstructor.read(testConstants.MASK_1);

        image.mask(mask, -50, -80);

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "with-aliasing",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG2);
        const mask = await JimpConstructor.read(testConstants.MASK_2);

        image.mask(mask);

        await imageStore.store(storageKey, image);
      },
    },
  ],
};
