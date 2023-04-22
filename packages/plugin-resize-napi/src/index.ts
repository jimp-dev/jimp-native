import { throwError } from "@jimp/utils";
import { Resize } from "@jimp/plugin-resize";
import { ImageCallback } from "@jimp/core";
import {
  ensureInteger,
  getAddonReleaseVersion,
  cppCallbackWrapper,
  AsyncPlugin,
  wrapAsync,
} from "@jimp-native/utils-ts";

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-resize-napi.node`);

type PluginResize = AsyncPlugin<Resize["class"]>;

const RESIZE_METHOD_MAP = {
  nearestNeighbor: 0,
  nearestNeighbour: 0,
  bilinearInterpolation: 1,
  bicubicInterpolation: 2,
  hermiteInterpolation: 3,
  bezierInterpolation: 4,
  defaultInterpolation: 99,
} as const;

type ResizeMethod = keyof typeof RESIZE_METHOD_MAP;

function resize(
  width: number,
  height: number,
  mode:
    | ResizeMethod
    | string
    | ImageCallback<PluginResize> = "defaultInterpolation",
  cb?: ImageCallback<PluginResize>
) {
  if (typeof mode === "function" && typeof cb === "undefined") {
    cb = mode;
    mode = "defaultInterpolation";
  }

  if (width === this.constructor.AUTO) {
    width = this.bitmap.width * (height / this.bitmap.height);
  }

  if (height === this.constructor.AUTO) {
    height = this.bitmap.height * (width / this.bitmap.width);
  }

  if (width <= 0) {
    return throwError.call(this, "Width must be greater than zero", cb);
  }

  if (height <= 0) {
    return throwError.call(this, "Height must be greater than zero", cb);
  }

  let modeNumber = RESIZE_METHOD_MAP[mode as string];

  if (typeof modeNumber !== "number") {
    modeNumber = 99;
  }

  width = ensureInteger(width);
  height = ensureInteger(height);
  const targetBitmapData = Buffer.alloc(width * height * 4);

  try {
    const originalBitmap = this.bitmap.data;
    const originalWidth = this.bitmap.width;
    const originalHeight = this.bitmap.height;

    this.bitmap.data = targetBitmapData;
    this.bitmap.width = width;
    this.bitmap.height = height;

    addon.resize(
      originalBitmap,
      originalWidth,
      originalHeight,
      targetBitmapData,
      width,
      height,
      modeNumber,
      cppCallbackWrapper(this, cb)
    );

    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
}

const plugin: () => PluginResize = () => ({
  resize,
  resizeAsync: wrapAsync(resize),
});

export default plugin;
