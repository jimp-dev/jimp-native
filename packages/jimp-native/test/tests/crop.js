const testConstants = require('../test-constants');
const { PHASE_TYPES } = testConstants;

module.exports = {
    name: 'crop',
    phases: [
        {
            name: '1-border',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.crop(1, 1, image.getWidth() - 2, image.getHeight() - 2);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: '50',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.crop(50, 50, image.getWidth() - 100, image.getHeight() - 100);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'js-shortcut',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.crop(0, 0, image.getWidth(), image.getHeight() - 40);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: '0-x-y',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.crop(0, 0, 0, 0);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: '1-px',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                image.crop(0, 0, image.getWidth() - 1, image.getHeight() - 1);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'auto-simple',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                image.autocrop();

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'auto-no-tolerance',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                image.autocrop({ tolerance: 0 });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'auto-symmetry',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                image.autocrop({ cropSymmetric: true });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'auto-leave-border',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                image.autocrop({ leaveBorder: 1 });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'no-north',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                image.autocrop({ ignoreSides: { north: true }, cropOnlyFrames: false });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'no-south',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                image.autocrop({ ignoreSides: { south: true }, cropOnlyFrames: false });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'no-east',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                // HACK: Jimp messes up west and east, so for now, swap these mid test... // TODO: Tell Jimp about it.
                image.autocrop({ ignoreSides: (image.__native ? { east: true } : { west: true }), cropOnlyFrames: false });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'no-west',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                image.autocrop({ ignoreSides: (image.__native ? { west: true } : { east: true }), cropOnlyFrames: false });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'tolerance-direct-arg',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                image.autocrop(0.0);

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'crop-only-frames-direct-arg',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                image.autocrop(false);

                await imageStore.store(storageKey, image);
            }
        }
    ]
};
