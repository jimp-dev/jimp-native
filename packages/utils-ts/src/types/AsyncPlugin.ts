import { ImageCallback } from "@jimp/core";

type Plugin<Base> = {
    [K in keyof Base]: (...args: any[]) => any
}

type MethodNames<PluginInterface> = keyof PluginInterface;

type AsyncMethodNames<PluginInterface> = {
    [K in MethodNames<PluginInterface>]: `${K extends Extract<keyof PluginInterface, string> ? K : never}Async`
}

type GenerateAsyncMethods<PluginInterface> = {
    [K in AsyncMethodNames<PluginInterface>[MethodNames<PluginInterface>]]: PluginInterface[MethodNames<PluginInterface>]
}

type PromisifiedFunction<T> = T extends ((...args: [...infer Args, infer Callback]) => any)
    ? Callback extends ImageCallback<unknown>
    ? (...args: Args) => Promise<Parameters<Callback>[1]>
    : (...args: Args) => Promise<any>
    : never;

type PromisifiedInterface<Interface extends Plugin<Interface>> = {
    [K in keyof Interface]: PromisifiedFunction<Interface[keyof Interface]>
}

/**
 * Type that enforces that a plugin not only implements the upstream interface correctly but also has an async variant
 * of the method available.
 */
export type AsyncPlugin<BasePlugin extends Plugin<BasePlugin>> = PromisifiedInterface<GenerateAsyncMethods<BasePlugin>>;