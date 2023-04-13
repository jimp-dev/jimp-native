import { mergeDeep } from "timm";
import { jimpEvChange } from "@jimp/core";

import blit from "@jimp-native/plugin-blit-napi";
import blur from "@jimp-native/plugin-blur-napi";
import circle from "@jimp-native/plugin-circle-napi";
import color from "@jimp-native/plugin-color-napi";
import composite from "@jimp-native/plugin-composite-napi";
import crop from "@jimp-native/plugin-crop-napi";
import dither from "@jimp-native/plugin-dither-napi";
import flip from "@jimp-native/plugin-flip-napi";
import invert from "@jimp-native/plugin-invert-napi";
import mask from "@jimp-native/plugin-mask-napi";
import resize from "@jimp-native/plugin-resize-napi";
import rotate from "@jimp-native/plugin-rotate-napi";

import contain from "@jimp/plugin-contain";
import cover from "@jimp/plugin-cover";
import displace from "@jimp/plugin-displace";
import fisheye from "@jimp/plugin-fisheye";
import gaussian from "@jimp/plugin-gaussian";
import normalize from "@jimp/plugin-normalize";
import print from "@jimp/plugin-print";
import scale from "@jimp/plugin-scale";
import shadow from "@jimp/plugin-shadow";
import threshold from "@jimp/plugin-threshold";

export const nativePlugins = [
  blit,
  blur,
  circle,
  color,
  composite,
  crop,
  dither,
  flip,
  invert,
  mask,
  resize,
  rotate,
] as const;

export const unoptimizedPlugins = [
  contain,
  cover,
  displace,
  fisheye,
  gaussian,
  normalize,
  print,
  scale,
  shadow,
  threshold,
] as const;

export const combinedPlugins = [
  ...unoptimizedPlugins,
  ...nativePlugins,
] as const;

export const init = (evChange) =>
  combinedPlugins
    .map((pluginInitializer: (evChange?: typeof jimpEvChange) => Object) =>
      pluginInitializer(evChange)
    )
    .map((plugin) =>
      "class" in plugin || "constants" in plugin ? plugin : { class: plugin }
    )
    .reduce((result, currentPlugin) => mergeDeep(result, currentPlugin), {});
