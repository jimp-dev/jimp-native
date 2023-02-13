const { throwError, isNodePattern } = require("@jimp/utils");
const nativeAddon = require("../addon");
const Jimp = require("jimp");
const { ensureInteger, cppCallbackWrapper, isSynchronous } = require("../util");
const { RESIZE_MODE_MAP } = require("../../packages/jimp-native/lib/constants");

module.exports = {
  resize(width, height, mode, cb) {
    if (typeof width !== "number") {
      return throwError.call(this, "Width must be of type Number", cb);
    }

    if (typeof height !== "number") {
      return throwError.call(this, "Height must by of type Number", cb);
    }

    if (typeof mode === "function" && typeof cb === "undefined") {
      cb = mode;
      mode = null;
    }

    if (width === Jimp.AUTO && height === Jimp.AUTO) {
      return throwError.call(
        this,
        "Width and height cannot both be set to auto",
        cb
      );
    }

    if (width === this.constructor.AUTO) {
      width = this.bitmap.width * (height / this.bitmap.height);
    }

    if (height === this.constructor.AUTO) {
      height = this.bitmap.height * (width / this.bitmap.width);
    }

    if (width < 0) {
      return throwError.call(this, "Width must be a positive number", cb);
    }

    if (height < 0) {
      return throwError.call(this, "Height must be a positive number", cb);
    }

    mode = RESIZE_MODE_MAP[mode];

    if (typeof mode !== "number") {
      mode = -1;
    }

    width = ensureInteger(width);
    height = ensureInteger(height);
    const targetBitmapData = Buffer.allocUnsafe(width * height * 4);

    try {
      const originalBitmap = this.bitmap.data;
      const originalWidth = this.bitmap.width;
      const originalHeight = this.bitmap.height;

      this.bitmap.data = targetBitmapData;
      this.bitmap.width = width;
      this.bitmap.height = height;

      nativeAddon.resize(
        originalBitmap,
        originalWidth,
        originalHeight,
        targetBitmapData,
        width,
        height,
        mode,
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
