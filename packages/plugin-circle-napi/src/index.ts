import { throwError } from "@jimp/utils";
import { Circle } from "@jimp/plugin-circle";
import { ImageCallback } from "@jimp/core";
import {
  ensureInteger,
  getAddonReleaseVersion,
  cppCallbackWrapper,
  AsyncPlugin,
  wrapAsync,
} from "@jimp-native/utils-ts";

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-circle-napi.node`);

const circle = function (
  options:
    | {
        radius?: number;
        x?: number;
        y?: number;
      }
    | ImageCallback<AsyncPlugin<Circle>> = {},
  cb?: ImageCallback<AsyncPlugin<Circle>>
) {
  if (typeof options === "function") {
    cb = options;
    options = {};
  }

  const radius =
    options.radius || Math.min(this.getWidth(), this.getHeight()) / 2;
  const centreX = options.x || this.getWidth() / 2;
  const centreY = options.y || this.getHeight() / 2;

  try {
    addon.circle(
      this.bitmap.data,
      this.getWidth(),
      this.getHeight(),
      ensureInteger(radius),
      ensureInteger(centreX),
      ensureInteger(centreY),
      cppCallbackWrapper(this, cb)
    );

    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const plugin: () => AsyncPlugin<Circle> = () => ({
  circle,
  circleAsync: wrapAsync(circle),
});

export default plugin;
