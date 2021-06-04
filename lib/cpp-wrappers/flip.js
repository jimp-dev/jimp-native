const { throwError, isNodePattern } = require('@jimp/utils');
const nativeAddon = require('../addon');
const { cppCallbackWrapper, isSynchronous } = require('../util');

function flip (horizontally = true, vertically = false, cb) {
    try {
        if (horizontally || vertically) {
            nativeAddon.flip(
                this.bitmap.data,
                this.getWidth(),
                this.getHeight(),
                horizontally,
                vertically,
                cppCallbackWrapper(this, cb)
            );
        }

        if (isNodePattern(cb) && isSynchronous(this, cb)) {
            cb.call(this, null, this);
        }
    } catch (err) {
        return throwError.call(this, err, cb);
    }

    return this;
}

module.exports = {
    flip,
    mirror: flip
};
