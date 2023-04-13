import { throwError } from "@jimp/utils";
import color, { Color } from "@jimp/plugin-color";
import { ImageCallback } from "@jimp/core";
import {
  ensureInteger,
  getAddonReleaseVersion,
  cppCallbackWrapper,
  AsyncPlugin,
  wrapAsync,
  EdgeHandling,
} from "@jimp-native/utils-ts";

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-color-napi.node`);

type PartialAsyncColorPlugin = AsyncPlugin<
  Pick<
    Color,
    | "greyscale"
    | "grayscale"
    | "brightness"
    | "opacity"
    | "opaque"
    | "fade"
    | "contrast"
    | "posterize"
    | "sepia"
    | "convolution"
    | "convolute"
    | "pixelate"
  >
>;

type MixedPlugin = Color & PartialAsyncColorPlugin;

const PIXELATE_KERNEL = [
  [1 / 16, 2 / 16, 1 / 16],
  [2 / 16, 4 / 16, 2 / 16],
  [1 / 16, 2 / 16, 1 / 16],
];

const greyscale = function (cb?: ImageCallback<MixedPlugin>) {
  try {
    addon.greyscale(this.bitmap.data, cppCallbackWrapper(this, cb));
    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const brightness = function (
  brightness: number,
  cb?: ImageCallback<MixedPlugin>
) {
  try {
    addon.brightness(
      this.bitmap.data,
      brightness,
      cppCallbackWrapper(this, cb)
    );
    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const opacity = function (opacity: number, cb?: ImageCallback<MixedPlugin>) {
  try {
    addon.opacity(this.bitmap.data, opacity, cppCallbackWrapper(this, cb));
    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const opaque = function (cb?: ImageCallback<MixedPlugin>) {
  try {
    addon.opaque(this.bitmap.data, cppCallbackWrapper(this, cb));
    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const fade = function (f: number, cb?: ImageCallback<MixedPlugin>) {
  return opacity.bind(this)(1 - f, cb);
};

const contrast = function (contrast: number, cb?: ImageCallback<MixedPlugin>) {
  try {
    addon.contrast(this.bitmap.data, contrast, cppCallbackWrapper(this, cb));
    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const posterize = function (
  multiplier: number,
  cb?: ImageCallback<MixedPlugin>
) {
  try {
    addon.posterize(this.bitmap.data, multiplier, cppCallbackWrapper(this, cb));
    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const sepia = function (cb?: ImageCallback<MixedPlugin>) {
  try {
    addon.sepia(this.bitmap.data, cppCallbackWrapper(this, cb));
    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const convolution = function (
  kernel: number[][],
  edgeHandling:
    | EdgeHandling
    | ImageCallback<MixedPlugin> = EdgeHandling.EDGE_EXTEND,
  cb?: ImageCallback<MixedPlugin>
) {
  if (typeof edgeHandling === "function") {
    cb = edgeHandling;
    edgeHandling = EdgeHandling.EDGE_EXTEND;
  }

  try {
    addon.convolution(
      this.bitmap.data,
      this.getWidth(),
      this.getHeight(),
      kernel,
      edgeHandling,
      0,
      0,
      this.getWidth(),
      this.getHeight(),
      1,
      cppCallbackWrapper(this, cb)
    );

    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const convolute = function (
  kernel: number[][],
  x?: number | ImageCallback<MixedPlugin>,
  y?: number,
  w?: number,
  h?: number,
  cb?: ImageCallback<MixedPlugin>
) {
  if (typeof x === "function") {
    cb = x;
    x = 0;
  }

  try {
    addon.convolution(
      this.bitmap.data,
      this.getWidth(),
      this.getHeight(),
      kernel,
      EdgeHandling.EDGE_EXTEND,
      ensureInteger(x),
      ensureInteger(y),
      ensureInteger(w ?? this.getWidth()),
      ensureInteger(h ?? this.getHeight()),
      1,
      cppCallbackWrapper(this, cb)
    );
    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const pixelate = function (
  size: number,
  x?: number | ImageCallback<MixedPlugin>,
  y?: number,
  w?: number,
  h?: number,
  cb?: ImageCallback<MixedPlugin>
) {
  if (typeof x === "function") {
    cb = x;
    x = null;
    y = null;
    w = null;
    h = null;
  }

  x = x ?? 0;
  y = y ?? 0;
  w = w || this.bitmap.width - ensureInteger(x);
  h = h || this.bitmap.height - ensureInteger(y);

  try {
    addon.convolution(
      this.bitmap.data,
      this.getWidth(),
      this.getHeight(),
      PIXELATE_KERNEL,
      EdgeHandling.EDGE_EXTEND,
      ensureInteger(x),
      ensureInteger(y),
      ensureInteger(w),
      ensureInteger(h),
      size,
      cppCallbackWrapper(this, cb)
    );
    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const plugin: () => PartialAsyncColorPlugin = () => ({
  ...color(), // Merge with original implementation as our C++ coverage of color is not complete
  greyscale,
  greyscaleAsync: wrapAsync(greyscale),
  grayscale: greyscale,
  grayscaleAsync: wrapAsync(greyscale),
  brightness,
  brightnessAsync: wrapAsync(brightness),
  opacity,
  opacityAsync: wrapAsync(opacity),
  opaque,
  opaqueAsync: wrapAsync(opaque),
  fade,
  fadeAsync: wrapAsync(fade),
  contrast,
  contrastAsync: wrapAsync(contrast),
  posterize,
  posterizeAsync: wrapAsync(posterize),
  sepia,
  sepiaAsync: wrapAsync(sepia),
  convolution,
  convolutionAsync: wrapAsync(convolution),
  convolute,
  convoluteAsync: wrapAsync(convolute),
  pixelate,
  pixelateAsync: wrapAsync(pixelate),
});

export default plugin;
