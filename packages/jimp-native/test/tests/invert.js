const testConstants = require("../test-constants");
const { PHASE_TYPES } = testConstants;

module.exports = {
  name: "invert",
  phases: [
    {
      name: "simple",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        image.invert();

        await imageStore.store(storageKey, image);
      },
    },
    {
      name: "simple-async",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image = await JimpConstructor.read(testConstants.IMG1);

        if (image.__native) {
          await image.invertAsync();
        } else {
          image.invert();
        }

        await imageStore.store(storageKey, image);
      },
    },
  ],
};
