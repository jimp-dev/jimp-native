const testConstants = require('../test-constants');
const { PHASE_TYPES } = testConstants;

module.exports = {
    name: 'rotate',
    phases: [
        {
            name: '90-no-resize',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.rotate(90, false);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: '180-no-resize',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.rotate(180, false);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: '270-no-resize',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.rotate(270, false);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: '45-no-resize',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.rotate(45, false);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: '90',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.rotate(90);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: '180',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.rotate(180);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: '270',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.rotate(270);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: '45',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.rotate(45);

                await imageStore.store(storageKey, image);
            }
        }
    ]
};
