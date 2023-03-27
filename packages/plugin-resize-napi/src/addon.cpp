#include <napi.h>

#include "wrapper.hpp"
#include "./wrapResize.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    exports.Set(Napi::String::New(env, "resize"), Napi::Function::New(env, wrapErrorHandler(wrapResize, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginResizeNapi, Init)
