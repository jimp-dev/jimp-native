import { throwError } from "@jimp/utils";
import { Mask } from "@jimp/plugin-mask";
import { ImageCallback } from "@jimp/core";
import {
  ensureInteger,
  getAddonReleaseVersion,
  cppCallbackWrapper,
  AsyncPlugin,
  wrapAsync,
} from "@jimp-native/utils-ts";
import Jimp from "jimp";

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-mask-napi.node`);

const mask = function (
  sourceImage: Jimp,
  xOffset?: number | ImageCallback<AsyncPlugin<Mask>>,
  yOffset?: number,
  cb?: ImageCallback<AsyncPlugin<Mask>>
) {
  if (!(sourceImage instanceof this.constructor)) {
    return throwError.call(this, "sourceImage must be a Jimp image");
  }

  if (typeof xOffset === "function") {
    cb = xOffset;
    xOffset = 0;
  }

  try {
    addon.mask(
      sourceImage.bitmap.data,
      sourceImage.getWidth(),
      sourceImage.getHeight(),
      this.bitmap.data,
      this.getWidth(),
      this.getHeight(),
      ensureInteger(xOffset || 0),
      ensureInteger(yOffset || 0),
      cppCallbackWrapper(this, cb)
    );

    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const plugin: () => AsyncPlugin<Mask> = () => ({
  mask,
  maskAsync: wrapAsync(mask),
});

export default plugin;
