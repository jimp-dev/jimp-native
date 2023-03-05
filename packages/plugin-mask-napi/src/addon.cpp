#include <napi.h>

#include "wrapper.hpp"
#include "./wrapMask.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    exports.Set(Napi::String::New(env, "mask"), Napi::Function::New(env, wrapErrorHandler(wrapMask, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginMaskNapi, Init)
