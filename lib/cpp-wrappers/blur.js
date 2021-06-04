const { throwError, isNodePattern } = require('@jimp/utils');
const nativeAddon = require('../addon');
const { ensureInteger, cppCallbackWrapper, isSynchronous } = require('../util');

module.exports = {
    blur (r, cb) {
        try {
            nativeAddon.blur(
                this.bitmap.data,
                this.getWidth(),
                this.getHeight(),
                ensureInteger(r),
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
};
