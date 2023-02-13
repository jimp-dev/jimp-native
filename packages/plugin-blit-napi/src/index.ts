import { throwError } from "@jimp/utils";
import { Blit } from "@jimp/plugin-blit";
import { ImageCallback } from "@jimp/core";
import {
  ensureInteger,
  getAddonReleaseVersion,
  cppCallbackWrapper,
  cppPromiseHandler,
  AsyncPlugin,
} from "@jimp-native/utils-ts";
import Jimp from "jimp";

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-blit-napi.node`);

const blit = function (
  sourceImage: Jimp,
  xOffset: number,
  yOffset: number,
  sourceX?: number | ImageCallback<Blit>,
  sourceY?: number,
  sourceW?: number,
  sourceH?: number,
  cb?: ImageCallback<Blit>
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
  } catch (err) {
    return throwError.call(this, err, cb);
  }

  return this;
};

const plugin: () => AsyncPlugin<Blit> = () => ({
  blit,
  blitAsync: (
    sourceImage: Jimp,
    xOffset: number,
    yOffset: number,
    sourceX?: number,
    sourceY?: number,
    sourceW?: number,
    sourceH?: number
  ) =>
    new Promise((resolve, reject) => {
      blit(
        sourceImage,
        xOffset,
        yOffset,
        sourceX,
        sourceY,
        sourceW,
        sourceH,
        cppPromiseHandler(this, resolve, reject)
      );
    }),
});

export default plugin;
