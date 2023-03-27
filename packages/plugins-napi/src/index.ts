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

const plugins = [
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
];

export default (evChange) =>
  plugins
    .map((pluginInitializer: (evChange?: typeof jimpEvChange) => Object) =>
      pluginInitializer(evChange)
    )
    .reduce((result, currentPlugin) => mergeDeep(result, currentPlugin), {});
