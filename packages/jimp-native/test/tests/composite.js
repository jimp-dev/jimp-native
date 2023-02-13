const testConstants = require("../test-constants");
const { PHASE_TYPES } = testConstants;

const phases = [];

// Instead of writing a test phase for each blend mode, automate it.
function constructBlendModeTestPhases() {
  // eslint-disable-next-line guard-for-in
  for (const blendMode in testConstants.BLEND_MODE_MAP) {
    phases.push({
      name: blendMode,
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image1 = await JimpConstructor.read(testConstants.IMG1);
        const image2 = await JimpConstructor.read(testConstants.IMG2);

        image1.composite(image2, 0, 0, {
          mode: blendMode,
          opacitySource: 0.5,
          opacityDest: 0.5,
        });

        await imageStore.store(storageKey, image1);
      },
    });

    phases.push({
      name: blendMode + "-alpha",
      type: PHASE_TYPES.COMPARISON,
      run: async (JimpConstructor, storageKey, imageStore) => {
        const image1 = await JimpConstructor.read(testConstants.IMG1);
        const image2 = await JimpConstructor.read(testConstants.IMG2);

        image1.opacity(0.3);
        image2.opacity(0.3);

        image1.composite(image2, 0, 0, {
          mode: blendMode,
          opacitySource: 0.5,
          opacityDest: 0.5,
        });

        await imageStore.store(storageKey, image1);
      },
    });
  }
}

phases.push({
  name: "negative-x-y-offset",
  type: PHASE_TYPES.COMPARISON,
  run: async (JimpConstructor, storageKey, imageStore) => {
    const image1 = await JimpConstructor.read(testConstants.IMG1);
    const image2 = await JimpConstructor.read(testConstants.IMG2);

    image1.composite(image2, -50, -50, {
      opacitySource: 0.5,
      opacityDest: 0.5,
    });

    await imageStore.store(storageKey, image1);
  },
});

phases.push({
  name: "positive-x-y-offset",
  type: PHASE_TYPES.COMPARISON,
  run: async (JimpConstructor, storageKey, imageStore) => {
    const image1 = await JimpConstructor.read(testConstants.IMG1);
    const image2 = await JimpConstructor.read(testConstants.IMG2);

    image1.composite(image2, 50, 50, { opacitySource: 0.5, opacityDest: 0.5 });

    await imageStore.store(storageKey, image1);
  },
});

constructBlendModeTestPhases();

module.exports = {
  name: "composite",
  phases,
};
