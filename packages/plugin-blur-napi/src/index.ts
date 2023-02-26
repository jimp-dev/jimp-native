import { throwError } from "@jimp/utils";
import { Blur } from "@jimp/plugin-blur";
import { ImageCallback } from "@jimp/core";
import {
  ensureInteger,
  getAddonReleaseVersion,
  cppCallbackWrapper,
  AsyncPlugin,
  wrapAsync,
} from "@jimp-native/utils-ts";

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-blur-napi.node`);

const blur = function (r: number, cb?: ImageCallback<AsyncPlugin<Blur>>) {
  try {
    addon.blur(
      this.bitmap.data,
      this.getWidth(),
      this.getHeight(),
      ensureInteger(r),
      cppCallbackWrapper(this, cb)
    );

    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const plugin: () => AsyncPlugin<Blur> = () => ({
  blur,
  blurAsync: wrapAsync(blur),
});

export default plugin;
