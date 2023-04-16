import { Mutable } from "@jimp-native/utils-ts";
import configure from "@jimp/custom";
import plugins from "@jimp/plugins";
import types from "@jimp/types";
import { BaseJimp } from "./comparisonTest";

export const constructJimpWithOverrides = <TypeOverrides, PluginOverrides>({
  typeOverrides,
  pluginOverrides,
}: {
  typeOverrides: Mutable<TypeOverrides[]>;
  pluginOverrides: Mutable<PluginOverrides[]>;
}) =>
  configure({
    types: [types, ...typeOverrides] as Mutable<
      (typeof types)[] & TypeOverrides
    >,
    plugins: [plugins, ...pluginOverrides] as Mutable<
      (typeof plugins)[] & PluginOverrides
    >,
  }) as BaseJimp;
