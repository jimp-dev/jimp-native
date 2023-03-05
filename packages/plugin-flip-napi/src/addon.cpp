#include <napi.h>

#include "wrapper.hpp"
#include "./wrapFlip.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    exports.Set(Napi::String::New(env, "flip"), Napi::Function::New(env, wrapErrorHandler(wrapFlip, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginFlipNapi, Init)
