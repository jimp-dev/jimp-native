const testConstants = require('../test-constants');
const { PHASE_TYPES } = testConstants;

module.exports = {
    name: 'print',
    phases: [
        {
            name: 'simple-builtin-fonts',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);
                const font = await JimpConstructor.loadFont(JimpConstructor.FONT_SANS_32_WHITE);

                image.print(font, 10, 20, 'PRINT TEST');
                image.print(font, 10, 50, 'print test');

                await imageStore.store(storageKey, image);
            }
        }
    ]
};
