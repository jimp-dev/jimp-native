import { mergeDeep } from "timm";
import { jimpEvChange } from "@jimp/core";

import blit from "@jimp-native/plugin-blit-napi";
import blur from "@jimp-native/plugin-blur-napi";
import circle from "@jimp-native/plugin-circle-napi";
import color from "@jimp-native/plugin-color-napi";

const plugins = [blit, blur, circle, color];

export default (evChange) =>
  plugins
    .map((pluginInitializer: (evChange?: typeof jimpEvChange) => Object) =>
      pluginInitializer(evChange)
    )
    .reduce((result, currentPlugin) => mergeDeep(result, currentPlugin), {});
