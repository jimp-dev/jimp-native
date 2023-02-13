const testConstants = require('../test-constants');
const { PHASE_TYPES } = testConstants;

module.exports = {
    name: 'dither',
    phases: [
        {
            name: 'dither16',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.dither16();

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'dither565',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.dither565();

                await imageStore.store(storageKey, image);
            }
        }
    ]
};
