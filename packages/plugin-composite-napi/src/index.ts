import { throwError } from "@jimp/utils";
import { Jimp, ImageCallback, Image, BlendMode } from "@jimp/core";
import {
  ensureInteger,
  getAddonReleaseVersion,
  cppCallbackWrapper,
  AsyncPlugin,
  wrapAsync,
} from "@jimp-native/utils-ts";
import FullJimp from "jimp";

type PluginComposite = Pick<Jimp, "composite">;

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-composite-napi.node`);

const BLEND_MODE_MAP = {
  [FullJimp.BLEND_SOURCE_OVER]: 0,
  [FullJimp.BLEND_DESTINATION_OVER]: 1,
  [FullJimp.BLEND_MULTIPLY]: 2,
  [FullJimp.BLEND_ADD]: 3,
  [FullJimp.BLEND_SCREEN]: 4,
  [FullJimp.BLEND_OVERLAY]: 5,
  [FullJimp.BLEND_DARKEN]: 6,
  [FullJimp.BLEND_LIGHTEN]: 7,
  [FullJimp.BLEND_HARDLIGHT]: 8,
  [FullJimp.BLEND_DIFFERENCE]: 9,
  [FullJimp.BLEND_EXCLUSION]: 10,
} as const;

const composite = function (
  sourceImage: Jimp,
  x: number,
  y: number,
  options: Partial<BlendMode> = {},
  cb?: ImageCallback<Jimp>
) {
  if (typeof options === "function") {
    cb = options;
    options = {};
  }

  if (!(sourceImage instanceof this.constructor)) {
    return throwError.call(this, "sourceImage must be a Jimp image");
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
    mode = FullJimp.BLEND_SOURCE_OVER;
  }

  try {
    addon.composite(
      sourceImage.bitmap.data,
      sourceImage.getWidth(),
      sourceImage.getHeight(),
      this.bitmap.data,
      this.getWidth(),
      this.getHeight(),
      ensureInteger(x),
      ensureInteger(y),
      BLEND_MODE_MAP[mode] || BLEND_MODE_MAP[FullJimp.BLEND_SOURCE_OVER],
      opacitySource ?? 1.0,
      cppCallbackWrapper(this, cb)
    );

    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const plugin: () => AsyncPlugin<PluginComposite> = () => ({
  composite,
  compositeAsync: wrapAsync(composite),
});

export default plugin;
