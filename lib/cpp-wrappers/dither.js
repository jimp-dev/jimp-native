const { throwError, isNodePattern } = require('@jimp/utils');
const nativeAddon = require('../addon');
const { cppCallbackWrapper, isSynchronous } = require('../util');

function dither (cb) {
    try {
        nativeAddon.dither(
            this.bitmap.data,
            this.getWidth(),
            this.getHeight(),
            cppCallbackWrapper(this, cb)
        );

        if (isNodePattern(cb) && isSynchronous(this, cb)) {
            cb.call(this, null, this);
        }
    } catch (err) {
        return throwError.call(this, err, cb);
    }

    return this;
}

module.exports = {
    dither565: dither,
    dither16: dither
};
