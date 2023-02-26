import { ImageCallback } from "@jimp/core";

export type PromisifiedFunction<T> = T extends (
  this: infer This,
  ...args: [...infer Args, infer Callback]
) => unknown
  ? Callback extends ImageCallback<This>
    ? (...args: Args) => Promise<Parameters<Callback>[1]>
    : (...args: Args) => Promise<any>
  : never;

type Asyncify<BasePlugin> = {
  [K in keyof BasePlugin as K extends string
    ? `${K}Async`
    : never]: PromisifiedFunction<BasePlugin[K]>;
};

/**
 * Type that enforces that a plugin not only implements the upstream interface correctly but also has an async variant
 * of the method available.
 */
export type AsyncPlugin<BasePlugin> = BasePlugin & Asyncify<BasePlugin>;
