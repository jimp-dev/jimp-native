#include <napi.h>

#include "wrapper.hpp"
#include "./wrapInvert.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    exports.Set(Napi::String::New(env, "invert"), Napi::Function::New(env, wrapErrorHandler(wrapInvert, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginInvertNapi, Init)
