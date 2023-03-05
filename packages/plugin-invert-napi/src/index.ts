import { throwError } from "@jimp/utils";
import { Invert } from "@jimp/plugin-invert";
import {
  getAddonReleaseVersion,
  cppCallbackWrapper,
  AsyncPlugin,
  wrapAsync,
} from "@jimp-native/utils-ts";
import { ImageCallback } from "@jimp/core";

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-invert-napi.node`);

const invert = function (cb?: ImageCallback<AsyncPlugin<Invert>>) {
  try {
    addon.invert(this.bitmap.data, cppCallbackWrapper(this, cb));
    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const plugin: () => AsyncPlugin<Invert> = () => ({
  invert,
  invertAsync: wrapAsync(invert),
});

export default plugin;
