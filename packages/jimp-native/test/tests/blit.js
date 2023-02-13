const testConstants = require("../test-constants");
const { PHASE_TYPES } = testConstants;

module.exports = {
  name: "blit",
  phases: [
    {
      name: "simple-positive-offsets",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const source = await JimpConstructor.read(testConstants.IMG1);
        const target = await JimpConstructor.read(testConstants.IMG4);

        target.blit(source, target.getWidth() / 2, target.getHeight() / 2);

        await imageStore.store(storageKey, target);
      },
    },
    {
      name: "simple-negative-offsets",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const source = await JimpConstructor.read(testConstants.IMG1);
        const target = await JimpConstructor.read(testConstants.IMG4);

        target.blit(
          source,
          -(target.getWidth() / 2),
          -(target.getHeight() / 2)
        );

        await imageStore.store(storageKey, target);
      },
    },
    {
      name: "simple-with-transparency",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const source = await JimpConstructor.read(testConstants.IMG1);
        const target = await JimpConstructor.read(testConstants.IMG4);

        source.opacity(0.4);
        target.opacity(0.4);

        target.blit(source, target.getWidth() / 2, target.getHeight() / 2);

        await imageStore.store(storageKey, target);
      },
    },
  ],
};
