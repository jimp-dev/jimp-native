#include <napi.h>

#include "wrapper.hpp"
#include "./wrapCrop.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    exports.Set(Napi::String::New(env, "crop"), Napi::Function::New(env, wrapErrorHandler(wrapCrop, *referenceFactory)));
    exports.Set(Napi::String::New(env, "autocrop"), Napi::Function::New(env, wrapErrorHandler(wrapAutocrop, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginCropNapi, Init)
