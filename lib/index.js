const Jimp = require('jimp');
const { addJimpMethods } = require('@jimp/core');

const JIMP_OPTIMISATIONS = {
    ...require('./cpp-wrappers/blit'),
    ...require('./cpp-wrappers/blur'),
    ...require('./cpp-wrappers/circle'),
    ...require('./cpp-wrappers/colour'),
    ...require('./cpp-wrappers/composite'),
    ...require('./cpp-wrappers/crop'),
    ...require('./cpp-wrappers/dither'),
    ...require('./cpp-wrappers/flip'),
    ...require('./cpp-wrappers/mask'),
    ...require('./cpp-wrappers/invert'),
    ...require('./cpp-wrappers/resize'),
    ...require('./cpp-wrappers/rotate')
};

module.exports = (trueAsync) => {
    addJimpMethods(JIMP_OPTIMISATIONS);
    
    Jimp.prototype.__native = true;

    if (trueAsync) {
        Jimp.__trueAsync = true;

        // Generate Promise-based versions of each method if trueAsync is enabled.
        const asyncOptimisations = {};
        for (const optimisationName of Object.keys(JIMP_OPTIMISATIONS)) {
            const fn = JIMP_OPTIMISATIONS[optimisationName];
            asyncOptimisations[optimisationName + 'Async'] = function (...args) {
                return new Promise ((resolve, reject) => {
                    try {
                        fn.call(this, ...args, (err) => {
                            if (err) {
                                return reject(err);
                            }

                            resolve(this);
                        });
                    } catch (err) {
                        reject(err);
                    }
                });
            };
        }

        addJimpMethods(asyncOptimisations);
    }

    return Jimp;
};
