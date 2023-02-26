#include <napi.h>

#include "wrapper.hpp"
#include "./wrapColor.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    // Colour module
    exports.Set(Napi::String::New(env, "opacity"), Napi::Function::New(env, wrapErrorHandler(wrapOpacity, *referenceFactory)));
    exports.Set(Napi::String::New(env, "opaque"), Napi::Function::New(env, wrapErrorHandler(wrapOpaque, *referenceFactory)));
    exports.Set(Napi::String::New(env, "brightness"), Napi::Function::New(env, wrapErrorHandler(wrapBrightness, *referenceFactory)));
    exports.Set(Napi::String::New(env, "contrast"), Napi::Function::New(env, wrapErrorHandler(wrapContrast, *referenceFactory)));
    exports.Set(Napi::String::New(env, "posterize"), Napi::Function::New(env, wrapErrorHandler(wrapPosterize, *referenceFactory)));
    exports.Set(Napi::String::New(env, "sepia"), Napi::Function::New(env, wrapErrorHandler(wrapSepia, *referenceFactory)));
    exports.Set(Napi::String::New(env, "convolution"), Napi::Function::New(env, wrapErrorHandler(wrapConvolution, *referenceFactory)));
    exports.Set(Napi::String::New(env, "greyscale"), Napi::Function::New(env, wrapErrorHandler(wrapGreyscale, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginColorNapi, Init)
