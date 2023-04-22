import { Mutable } from "@jimp-native/utils-ts";
import plugins from "@jimp/plugins";
import types from "@jimp/types";
import configureType from "@jimp/custom";
import { BaseJimp } from "./comparisonTest";

export const constructJimpWithOverrides = <TypeOverrides, PluginOverrides>({
  typeOverrides,
  pluginOverrides,
}: {
  typeOverrides: Mutable<TypeOverrides[]>;
  pluginOverrides: Mutable<PluginOverrides[]>;
}) => {
  jest.resetModules();
  const { default: Jimp } = require("@jimp/core");
  const configure = require("@jimp/custom") as typeof configureType;

  return configure(
    {
      types: [types, ...typeOverrides] as Mutable<
        (typeof types)[] & TypeOverrides
      >,
      plugins: [
        plugins,
        ...pluginOverrides,
        () => ({ __custom: true }),
      ] as Mutable<(typeof plugins)[] & PluginOverrides>,
    },
    Jimp
  ) as BaseJimp;
};
