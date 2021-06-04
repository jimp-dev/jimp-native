const testConstants = require('../test-constants');
const { PHASE_TYPES } = testConstants;

module.exports = {
    name: 'flip',
    phases: [
        {
            name: 'x',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.flip(true, false);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'y',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.flip(false, true);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'x-y',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.flip(true, true);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'x-uneven',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.crop(
                    0, 
                    0,
                    (image.getWidth() % 2 === 0) ? image.getWidth() - 2 : image.getWidth(),
                    (image.getHeight() % 2 === 0) ? image.getHeight() - 2 : image.getHeight()
                );

                image.flip(true, true);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'y-uneven',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.crop(
                    0, 
                    0,
                    (image.getWidth() % 2 === 0) ? image.getWidth() - 1 : image.getWidth(),
                    (image.getHeight() % 2 === 0) ? image.getHeight() - 1 : image.getHeight()
                );

                image.flip(true, true);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'x-y-uneven',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.crop(
                    0, 
                    0,
                    (image.getWidth() % 2 === 0) ? image.getWidth() - 1 : image.getWidth(),
                    (image.getHeight() % 2 === 0) ? image.getHeight() - 1 : image.getHeight()
                );

                image.flip(true, true);

                await imageStore.store(storageKey, image);
            }
        }
    ]
};
