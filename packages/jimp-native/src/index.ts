import configure from "@jimp/custom";
import jsTypes from "@jimp/types";
import { init, combinedPlugins } from "@jimp-native/plugins-napi";
import { coreMethods } from "./coreMethods";

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

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export default configure<
  Mutable<typeof types>,
  Mutable<typeof finalPluginListType>
>({
  types: [...types],
  plugins: plugins as Mutable<typeof finalPluginListType>,
});
