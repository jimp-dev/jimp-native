import { throwError } from "@jimp/utils";
import { Dither } from "@jimp/plugin-dither";
import {
  getAddonReleaseVersion,
  cppCallbackWrapper,
  AsyncPlugin,
  wrapAsync,
} from "@jimp-native/utils-ts";
import { ImageCallback } from "@jimp/core";

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-dither-napi.node`);

const dither = function (cb?: ImageCallback<AsyncPlugin<Dither>>) {
  try {
    addon.dither(
      this.bitmap.data,
      this.getWidth(),
      this.getHeight(),
      cppCallbackWrapper(this, cb)
    );
    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const plugin: () => AsyncPlugin<Dither> = () => ({
  dither16: dither,
  dither16Async: wrapAsync(dither),
  dither565: dither,
  dither565Async: wrapAsync(dither),
});

export default plugin;
