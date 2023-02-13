#pragma once
#include "./referenceFactory.hpp"
#include <napi.h>

/**
 * A wrapper functions are just glue code that translate the high level JS calls coming in through the Node Addon API
 * to the generic C++ implementations of each plugin.
 */
typedef void (*WrapperFunction) (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);

/**
 * Wraps a wrapper function in a generic error handler that bubbles JS errors thrown by C++ up to JavaScript land.
 * Returns a callable that can be passed to Napi::Function::New.
 */
auto wrapErrorHandler(WrapperFunction fn, ReferenceFactory& referenceFactory) {
    return [fn, &referenceFactory] (const Napi::CallbackInfo& info) {
        try {
            fn(info, referenceFactory);
        } catch (Napi::Error& err) {
            err.ThrowAsJavaScriptException();
        } catch (std::exception& err) {
            Napi::Error wrappedError = Napi::Error::New(info.Env(), err.what());
            wrappedError.ThrowAsJavaScriptException();
        }
    };
}