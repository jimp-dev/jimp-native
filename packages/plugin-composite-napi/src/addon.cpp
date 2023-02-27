#include <napi.h>

#include "wrapper.hpp"
#include "./wrapComposite.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    exports.Set(Napi::String::New(env, "composite"), Napi::Function::New(env, wrapErrorHandler(wrapComposite, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginCompositeNapi, Init)
