const { throwError, isNodePattern } = require("@jimp/utils");
const nativeAddon = require("../addon");
const Jimp = require("jimp");
const { ensureInteger, cppCallbackWrapper, isSynchronous } = require("../util");

module.exports = {
  mask(sourceImage, xOffset = 0, yOffset = 0, cb) {
    if (!(sourceImage instanceof Jimp)) {
      return throwError.call(this, "Source image must be a Jimp image.");
    }

    if (typeof xOffset === "function") {
      cb = xOffset;
      xOffset = 0;
    }

    try {
      nativeAddon.mask(
        sourceImage.bitmap.data,
        sourceImage.getWidth(),
        sourceImage.getHeight(),
        this.bitmap.data,
        this.getWidth(),
        this.getHeight(),
        ensureInteger(xOffset),
        ensureInteger(yOffset),
        cppCallbackWrapper(this, cb)
      );

      if (isNodePattern(cb) && isSynchronous(this, cb)) {
        cb.call(this, null, this);
      }
    } catch (err) {
      return throwError.call(this, err, cb);
    }

    return this;
  },
};
