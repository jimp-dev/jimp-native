import { throwError } from "@jimp/utils";
import { Blit } from "@jimp/plugin-blit";
import { ImageCallback } from "@jimp/core";
import {
  ensureInteger,
  getAddonReleaseVersion,
  cppCallbackWrapper,
  AsyncPlugin,
  wrapAsync,
} from "@jimp-native/utils-ts";
import Jimp from "jimp";

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-blit-napi.node`);

const blit = function (
  sourceImage: Jimp,
  xOffset: number,
  yOffset: number,
  sourceX?: number | ImageCallback<AsyncPlugin<Blit>>,
  sourceY?: number,
  sourceW?: number,
  sourceH?: number,
  cb?: ImageCallback<AsyncPlugin<Blit>>
) {
  if (!(sourceImage instanceof this.constructor)) {
    return throwError.call(this, "sourceImage must be a Jimp image");
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
    addon.blit(
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

    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const plugin: () => AsyncPlugin<Blit> = () => ({
  blit,
  blitAsync: wrapAsync(blit),
});

export default plugin;
