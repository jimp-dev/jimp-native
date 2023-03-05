#include <napi.h>

#include "wrapper.hpp"
#include "./wrapDither.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    exports.Set(Napi::String::New(env, "dither"), Napi::Function::New(env, wrapErrorHandler(wrapDither, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginCompositeNapi, Init)
