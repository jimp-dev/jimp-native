import { throwError } from "@jimp/utils";
import { Flip } from "@jimp/plugin-flip";
import { ImageCallback } from "@jimp/core";
import {
  ensureInteger,
  getAddonReleaseVersion,
  cppCallbackWrapper,
  AsyncPlugin,
  wrapAsync,
} from "@jimp-native/utils-ts";

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-flip-napi.node`);

function flip(
  horizontally = true,
  vertically = false,
  cb?: ImageCallback<AsyncPlugin<Flip>>
) {
  try {
    if (horizontally || vertically) {
      addon.flip(
        this.bitmap.data,
        this.getWidth(),
        this.getHeight(),
        horizontally,
        vertically,
        cppCallbackWrapper(this, cb)
      );
    }

    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
}

const plugin: () => AsyncPlugin<Flip> = () => ({
  flip,
  flipAsync: wrapAsync(flip),
  mirror: flip,
  mirrorAsync: wrapAsync(flip),
});

export default plugin;
