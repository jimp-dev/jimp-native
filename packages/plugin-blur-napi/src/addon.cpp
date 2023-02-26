#include <napi.h>

#include "wrapper.hpp"
#include "./wrapBlur.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    exports.Set(Napi::String::New(env, "blur"), Napi::Function::New(env, wrapErrorHandler(wrapBlur, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginBlitNapi, Init)
