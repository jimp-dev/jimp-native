#include <napi.h>

#include "wrapper.hpp"
#include "./wrapBlit.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    exports.Set(Napi::String::New(env, "blit"), Napi::Function::New(env, wrapErrorHandler(blit, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginBlitNapi, Init)
