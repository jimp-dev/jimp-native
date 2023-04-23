#include <napi.h>

#include "wrapper.hpp"
#include "./wrapRotate.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    exports.Set(Napi::String::New(env, "advancedRotate"), Napi::Function::New(env, wrapErrorHandler(wrapAdvancedRotate, *referenceFactory)));
    exports.Set(Napi::String::New(env, "matrixRotate"), Napi::Function::New(env, wrapErrorHandler(wrapMatrixRotate, *referenceFactory)));

    return exports;
}

NODE_API_MODULE(PluginRotateNapi, Init)
