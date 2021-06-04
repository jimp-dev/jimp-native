const testConstants = require('../test-constants');
const { PHASE_TYPES } = testConstants;

/**
 * Helper function to determine if a jimp-native call in async mode truly is async. Will reject if it isn't. Does not
 * trigger for normal jimp.
 * 
 * @param {Function} JimpConstructor 
 * @param {Function} testFn 
 * @returns 
 */
async function verifyAsync (JimpConstructor, testFn) {
    return new Promise ((resolve, reject) => {
        let asynchronous = false;

        const asyncDetect = () => {
            asynchronous = true;
        };
    
        const callback = () => {
            if (!asynchronous && JimpConstructor.__trueAsync) {
                return reject(new Error(`Received callback before async detection function, this call blocked!`));
            }

            resolve();
        };

        testFn(asyncDetect, callback);
    });
}

module.exports = {
    name: 'async',
    tolerance: 3, // This is due to blur.
    phases: [
        {
            name: 'blit',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const source = await JimpConstructor.read(testConstants.IMG1);
                const target = await JimpConstructor.read(testConstants.IMG4);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    target.blit(source, target.getWidth() / 2, target.getHeight() / 2, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, target);
            }
        },
        {
            name: 'blur',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG2);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.blur(1, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'circle',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.circle(callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'brightness',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.circle(callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'opacity',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.opacity(0.5, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'contrast',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.contrast(0.3, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'posterize',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.posterize(3, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'sepia',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.sepia(callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'convolution',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.convolution([
                        [ 1 / 256, 4  / 256, 6  / 256, 4  / 256, 1 / 256 ],
                        [ 4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256 ],
                        [ 6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256 ],
                        [ 4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256 ],
                        [ 1 / 256, 4  / 256, 6  / 256, 4  / 256, 1 / 256 ]
                    ], testConstants.JimpConstants.EDGE_EXTEND, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'opaque',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.opaque(callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'fade',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.fade(0.3, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'greyscale',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.greyscale(callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'pixelate',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.pixelate(10, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'composite',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image1 = await JimpConstructor.read(testConstants.IMG1);
                const image2 = await JimpConstructor.read(testConstants.IMG2);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image1.composite(image2, 50, 50, { opacitySource: 0.5, opacityDest: 0.5 }, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image1);
            }
        },
        {
            name: 'crop',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.crop(10, 10, image.getWidth() - 10, image.getHeight() - 10, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'autocrop',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.autocrop(callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'dither',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.dither16(callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'flip',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.flip(true, true, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'invert',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.AUTOCROP);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.invert(callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'mask',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG2);
                const mask = await JimpConstructor.read(testConstants.MASK_1);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.mask(mask, 50, 80, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'resize',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG2);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.resize(image.getWidth() * 3, image.getHeight() * 3, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        },
        {
            name: 'rotate-simple',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG2);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.rotate(30, false, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        }, {
            name: 'rotate',
            type: PHASE_TYPES.COMPARISON,
            run: async (JimpConstructor, storageKey, imageStore) => {
                const image = await JimpConstructor.read(testConstants.IMG2);

                await verifyAsync(JimpConstructor, (asyncDetect, callback) => {
                    image.rotate(30, callback);
                    asyncDetect();
                });

                await imageStore.store(storageKey, image);
            }
        }
    ]
};
