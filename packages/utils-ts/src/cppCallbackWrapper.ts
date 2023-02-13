import { ImageCallback } from '@jimp/core';
import Jimp from 'jimp';

const bitmapDenyProxy = new Proxy ({}, {
    get(target, prop) {
        throw new Error(`Attempted to access property "${String(prop)}" within bitmap data wile C++ thread is working on it.`);
    }
});

/**
 * Wraps an image callback (if provided) with some additional logic that prevents other async functions form operating
 * on this jimp instance and passes C++ errors as proper error instances if C++ throws anything.
 * 
 * @param jimpImage 
 * @param userCallback 
 */
export const cppCallbackWrapper = (jimpImage: Jimp, userCallback?: ImageCallback<any>) => {
    if (!userCallback) {
        return null;
    }

    const originalBitmap = jimpImage.bitmap.data;
    
    jimpImage.bitmap.data = bitmapDenyProxy as unknown as Buffer;

    return (...args) => {
        jimpImage.bitmap.data = originalBitmap;

        if (typeof args[0] === 'string') {
            args[0] = new Error(args[0]);
        }

        userCallback.bind(jimpImage).call(...args);
    }
}

/**
 * Creates a callback that can be used with addon code that either calls resolve or reject depending on the outcome.
 * Uses cppCallbackWrapper under the hood for thread safety and error handling.
 * 
 * @param resolve 
 * @param reject 
 */
export const cppPromiseHandler = (jimpImage: Jimp, resolve: Function, reject: Function) => cppCallbackWrapper(
    jimpImage,
    (err, value) => {
        if (err) {
            return reject(err);
        }

        resolve(value);
    }
)