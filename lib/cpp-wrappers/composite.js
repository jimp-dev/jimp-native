const { throwError, isNodePattern } = require("@jimp/utils");
const {
  BLEND_MODE_MAP,
  JimpConstants,
} = require("../../packages/jimp-native/lib/constants");
const { ensureInteger, cppCallbackWrapper, isSynchronous } = require("../util");
const nativeAddon = require("../addon");

module.exports = {
  composite(src, x, y, options = {}, cb) {
    if (typeof options === "function") {
      cb = options;
      options = {};
    }

    if (!(src instanceof this.constructor)) {
      return throwError.call(
        this,
        "The source image must be a Jimp/JimpNative image",
        cb
      );
    }

    let { mode, opacitySource, opacityDest } = options;

    if (
      typeof opacitySource !== "number" ||
      opacitySource < 0 ||
      opacitySource > 1
    ) {
      opacitySource = 1.0;
    }

    if (typeof opacityDest !== "number" || opacityDest < 0 || opacityDest > 1) {
      opacityDest = 1.0;
    }

    if (opacityDest !== 1.0) {
      this.opacity(opacityDest);
    }

    if (!mode) {
      mode = JimpConstants.BLEND_SOURCE_OVER;
    }

    try {
      nativeAddon.composite(
        src.bitmap.data,
        src.getWidth(),
        src.getHeight(),
        this.bitmap.data,
        this.getWidth(),
        this.getHeight(),
        ensureInteger(x),
        ensureInteger(y),
        BLEND_MODE_MAP[mode] || BLEND_MODE_MAP[JimpConstants.BLEND_SOURCE_OVER],
        opacitySource ?? 1.0,
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
};
