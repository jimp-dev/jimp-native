import configure from "@jimp/custom";
import jsTypes from "@jimp/types";
import { init, combinedPlugins } from "@jimp-native/plugins-napi";
import { coreMethods } from "./coreMethods";
import { Mutable } from "@jimp-native/utils-ts";

const nativeFlag = () => ({
  __native: true,
});

const finalPluginListType = [
  ...combinedPlugins,
  nativeFlag,
  coreMethods,
] as const;

const plugins = [init, nativeFlag, coreMethods];

const types = [jsTypes] as const;

export default configure<
  Mutable<typeof types>,
  Mutable<typeof finalPluginListType>
>({
  types: [...types],
  plugins: plugins as Mutable<typeof finalPluginListType>,
});
