import configure from "@jimp/custom";
import types from "@jimp/types";
import plugins from "@jimp-native/plugins-napi";
import { coreMethods } from "./coreMethods";

export default configure({
  types: [types],
  plugins: [
    plugins,
    () => ({
      __native: true,
    }),
    coreMethods,
  ],
});
