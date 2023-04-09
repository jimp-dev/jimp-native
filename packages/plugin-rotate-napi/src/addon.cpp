#include <napi.h>

#include "wrapper.hpp"
#include "./wrapRotate.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    exports.Set(Napi::String::New(env, "rotate"), Napi::Function::New(env, wrapErrorHandler(wrapRotate, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginResizeNapi, Init)
