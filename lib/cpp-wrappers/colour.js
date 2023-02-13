const { throwError, isNodePattern } = require('@jimp/utils');
const nativeAddon = require('../addon');
const constants = require('../../packages/jimp-native/lib/constants');
const { ensureInteger, isSynchronous, cppCallbackWrapper } = require('../util');

const PIXELATE_KERNEL = [
    [1 / 16, 2 / 16, 1 / 16],
    [2 / 16, 4 / 16, 2 / 16],
    [1 / 16, 2 / 16, 1 / 16]
];

function greyscale (cb) {
    try {
        nativeAddon.greyscale(this.bitmap.data, cppCallbackWrapper(this, cb));
    } catch (err) {
        return throwError.call(this, err, cb);
    }

    if (isNodePattern(cb) && isSynchronous(this, cb)) {
        cb.call(this, null, this);
    }
}

module.exports = {
    brightness (brightness, cb) {
        try {
            nativeAddon.brightness(this.bitmap.data, brightness, cppCallbackWrapper(this, cb));
        } catch (err) {
            return throwError.call(this, err, cb);
        }

        if (isNodePattern(cb) && isSynchronous(this, cb)) {
            cb.call(this, null, this);
        }

        return this;
    },

    opacity (opacity, cb) {
        try {
            nativeAddon.opacity(this.bitmap.data, opacity, cppCallbackWrapper(this, cb));
        } catch (err) {
            return throwError.call(this, err, cb);
        }

        if (isNodePattern(cb) && isSynchronous(this, cb)) {
            cb.call(this, null, this);
        }

        return this;
    },

    opaque (cb) {
        try {
            nativeAddon.opaque(this.bitmap.data, cppCallbackWrapper(this, cb));
        } catch (err) {
            return throwError(err, cb);
        }

        if (isNodePattern(cb) && isSynchronous(this, cb)) {
            cb.call(this, null, this);
        }

        return this;
    },

    fade (f, cb) {
        return this.opacity(1 - f, cb);
    },

    contrast (contrast, cb) {
        try {
            nativeAddon.contrast(this.bitmap.data, contrast, cppCallbackWrapper(this, cb));
        } catch (err) {
            return throwError.call(this, err, cb);
        }

        if (isNodePattern(cb) && isSynchronous(this, cb)) {
            cb.call(this, null, this);
        }

        return this;
    },

    posterize (multiplier, cb) {
        try {
            nativeAddon.posterize(this.bitmap.data, multiplier, cppCallbackWrapper(this, cb));
        } catch (err) {
            return throwError.call(this, err, cb);
        }

        if (isNodePattern(cb) && isSynchronous(this, cb)) {
            cb.call(this, null, this);
        }

        return this;
    },

    sepia (cb) {
        try {
            nativeAddon.sepia(this.bitmap.data, cppCallbackWrapper(this, cb));
        } catch (err) {
            return throwError.call(this, err, cb);
        }

        if (isNodePattern(cb) && isSynchronous(this, cb)) {
            cb.call(this, null, this);
        }

        return this;
    },

    convolution (kernel, edgeHandling = constants.JimpConstants.EDGE_EXTEND, cb) {
        if (typeof edgeHandling === 'function') {
            cb = edgeHandling;
            edgeHandling = constants.JimpConstants.EDGE_EXTEND;
        }

        try {
            nativeAddon.convolution(
                this.bitmap.data,
                this.getWidth(),
                this.getHeight(),
                kernel,
                edgeHandling,
                0,
                0,
                this.getWidth(),
                this.getHeight(),
                1,
                cppCallbackWrapper(this, cb)
            );
        } catch (err) {
            return throwError.call(this, err, cb);
        }

        if (isNodePattern(cb) && isSynchronous(this, cb)) {
            cb.call(this, null, this);
        }

        return this;
    },

    convolute (kernel, x, y, w, h, cb) {
        try {
            nativeAddon.convolution(
                this.bitmap.data,
                this.getWidth(),
                this.getHeight(),
                kernel,
                constants.JimpConstants.EDGE_EXTEND,
                ensureInteger(x),
                ensureInteger(y),
                ensureInteger(w),
                ensureInteger(h),
                1,
                cppCallbackWrapper(this, cb)
            );
        } catch (err) {
            return throwError.call(this, err, cb);
        }

        if (isNodePattern(cb) && isSynchronous(this, cb)) {
            cb.call(this, null, this);
        }

        return this;
    },

    greyscale,
    grayscale: greyscale,

    pixelate (size, x, y, w, h, cb) {

        if (typeof x === 'function') {
            cb = x;
            x = null;
            y = null;
            w = null;
            h = null;
        }

        x = x || 0;
        y = y || 0;
        w = w || this.bitmap.width - x;
        h = h || this.bitmap.height - y;

        try {
            nativeAddon.convolution(
                this.bitmap.data,
                this.getWidth(),
                this.getHeight(),
                PIXELATE_KERNEL,
                constants.JimpConstants.EDGE_EXTEND,
                ensureInteger(x),
                ensureInteger(y),
                ensureInteger(w),
                ensureInteger(h),
                size,
                cppCallbackWrapper(this, cb)
            );
        } catch (err) {
            return throwError.call(this, err, cb);
        }

        if (isNodePattern(cb) && isSynchronous(this, cb)) {
            cb.call(this, null, this);
        }

        return this;    
    }
};
