const testConstants = require('../test-constants');
const { PHASE_TYPES } = testConstants;

module.exports = {
    name: 'circle',
    phases: [
        {
            name: 'simple',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.circle();

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'radius-50',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.circle({ radius: 50 });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'offset',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.circle({ radius: 70, x: -10, y: 20 });

                await imageStore.store(storageKey, image);
            }
        }
    ]
};
