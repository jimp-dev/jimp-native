const { throwError, isNodePattern } = require("@jimp/utils");
const nativeAddon = require("../addon");
const Jimp = require("jimp");
const { ensureInteger, cppCallbackWrapper, isSynchronous } = require("../util");

module.exports = {
  blit(sourceImage, xOffset, yOffset, sourceX, sourceY, sourceW, sourceH, cb) {
    if (!(sourceImage instanceof Jimp)) {
      return throwError.call(this, "Source image must be a Jimp image.");
    }

    if (typeof sourceX === "function") {
      cb = sourceX;
      sourceX = 0;
    }

    sourceX = sourceX || 0;
    sourceY = sourceY || 0;
    sourceW = sourceW || sourceImage.getWidth();
    sourceH = sourceH || sourceImage.getHeight();

    try {
      nativeAddon.blit(
        sourceImage.bitmap.data,
        sourceImage.getWidth(),
        sourceImage.getHeight(),
        this.bitmap.data,
        this.getWidth(),
        this.getHeight(),
        ensureInteger(xOffset),
        ensureInteger(yOffset),
        ensureInteger(sourceX),
        ensureInteger(sourceY),
        ensureInteger(sourceW),
        ensureInteger(sourceH),
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
