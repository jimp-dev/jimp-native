#include <napi.h>

#include "wrapper.hpp"
#include "./wrapCircle.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    exports.Set(Napi::String::New(env, "circle"), Napi::Function::New(env, wrapErrorHandler(wrapCircle, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginCircleNapi, Init)
