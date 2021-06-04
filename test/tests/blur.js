const testConstants = require('../test-constants');
const { PHASE_TYPES } = testConstants;

module.exports = {
    name: 'blur',
    tolerance: 3, // C++ implementation has an algorithm that's slightly different, but very close.
    phases: [
        {
            name: 'size-1',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG2);

                image.blur(1);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'size-2',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG2);

                image.blur(2);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'size-10',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG2);

                image.blur(10);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'size-50',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG2);

                image.blur(50);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'size-100',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG2);

                image.blur(100);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'size-256',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG2);

                image.blur(256);

                await imageStore.store(storageKey, image);
            }
        }
    ]
};
