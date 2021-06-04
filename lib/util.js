function checkValidity (number) {
    if (
        typeof number !== 'number' ||
        Number.isNaN(number) ||
        !Number.isFinite(number)
    ) {
        return false;
    }

    return true;
}

/**
 * Ensures a given number is finite, not set to NaN and an integer.
 * 
 * @param {Number} number 
 * @returns 
 */
exports.ensureInteger = function (number) {
    if(!checkValidity(number)) {
        throw new Error('Expected a valid number, received: ' + number);
    }

    return Math.round(number);
};

const bitmapDenyProxy = new Proxy ({}, {
    get(target, prop) {
        throw new Error(`Attempted to access property "${prop}" within bitmap data wile C++ thread is working on it.`);
    }
});

/**
 * When running in async mode, this returns a wrapper function for the user provided callback, turning any C++ errors
 * into proper JS errors. Also makes sure that image bitmap data is not available while the async task is running.
 * 
 * @param {Object} jimpInstance 
 * @param {Function} userCallback 
 * @returns {Null|Function}
 */
exports.cppCallbackWrapper = (jimpInstance, userCallback) => {
    if (!jimpInstance.constructor.__trueAsync || typeof userCallback !== 'function') {
        return null;
    }

    const originalBitmap = jimpInstance.bitmap;
    jimpInstance.bitmap = bitmapDenyProxy;

    return (...args) => {
        jimpInstance.bitmap = originalBitmap;

        if (typeof args[0] === 'string') {
            args[0] = new Error(args[0]);
        }

        userCallback(...args, jimpInstance);
    };
};

/**
 * Returns true if library is running in synchronous mode or if running in async mode but without a callback.
 * 
 * @param {Object} jimpInstance 
 * @param {Function|undefined} cb
 * @returns {Boolean}
 */
exports.isSynchronous = (jimpInstance, cb) => {
    return !jimpInstance.constructor.__trueAsync || (jimpInstance.constructor.__trueAsync && typeof cb !== 'function');
};
