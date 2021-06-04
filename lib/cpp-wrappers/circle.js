const { throwError, isNodePattern } = require('@jimp/utils');
const nativeAddon = require('../addon');
const { ensureInteger, cppCallbackWrapper, isSynchronous } = require('../util');

module.exports = {
    circle (options = {}, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }

        const radius = options.radius || (Math.min(this.getWidth(), this.getHeight()) / 2);
        const centreX = options.x || (this.getWidth() / 2);
        const centreY = options.y || (this.getHeight() / 2);

        try {
            nativeAddon.circle(
                this.bitmap.data,
                this.getWidth(),
                this.getHeight(),
                ensureInteger(radius),
                ensureInteger(centreX),
                ensureInteger(centreY),
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
