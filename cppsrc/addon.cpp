#include <napi.h>
#include "./js-wrappers/wrapComposite.hpp"
#include "./js-wrappers/wrapColour.hpp"
#include "./js-wrappers/wrapBlit.hpp"
#include "./js-wrappers/wrapBlur.hpp"
#include "./js-wrappers/wrapCirlce.hpp"
#include "./js-wrappers/wrapCrop.hpp"
#include "./js-wrappers/wrapDither.hpp"
#include "./js-wrappers/wrapFlip.hpp"
#include "./js-wrappers/wrapMask.hpp"
#include "./js-wrappers/wrapInvert.hpp"
#include "./js-wrappers/wrapResize.hpp"
#include "./js-wrappers/wrapRotate.hpp"

#include "./util/referenceFactory.hpp"

ReferenceFactory referenceFactory;

typedef void (*WrapperFunction) (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);

/**
 * Wraps a wrapper function (yes) in a generic error handler that bubbles JS errors thrown by C++ up to JavaScript land.
 * Returns a callable that can be passed to Napi::Function::New.
 */
auto wrapErrorHandler(WrapperFunction fn) {
    return [=] (const Napi::CallbackInfo& info) {
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

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    // Compositing module
    exports.Set(Napi::String::New(env, "composite"), Napi::Function::New(env, wrapErrorHandler(wrapComposite)));

    // Colour module
    exports.Set(Napi::String::New(env, "opacity"), Napi::Function::New(env, wrapErrorHandler(wrapOpacity)));
    exports.Set(Napi::String::New(env, "opaque"), Napi::Function::New(env, wrapErrorHandler(wrapOpaque)));
    exports.Set(Napi::String::New(env, "brightness"), Napi::Function::New(env, wrapErrorHandler(wrapBrightness)));
    exports.Set(Napi::String::New(env, "contrast"), Napi::Function::New(env, wrapErrorHandler(wrapContrast)));
    exports.Set(Napi::String::New(env, "posterize"), Napi::Function::New(env, wrapErrorHandler(wrapPosterize)));
    exports.Set(Napi::String::New(env, "sepia"), Napi::Function::New(env, wrapErrorHandler(wrapSepia)));
    exports.Set(Napi::String::New(env, "convolution"), Napi::Function::New(env, wrapErrorHandler(wrapConvolution)));
    exports.Set(Napi::String::New(env, "greyscale"), Napi::Function::New(env, wrapErrorHandler(wrapGreyscale)));

    // Blit module
    exports.Set(Napi::String::New(env, "blit"), Napi::Function::New(env, wrapErrorHandler(wrapBlit)));

    // Blur module
    exports.Set(Napi::String::New(env, "blur"), Napi::Function::New(env, wrapErrorHandler(wrapBlur)));

    // Circle module
    exports.Set(Napi::String::New(env, "circle"), Napi::Function::New(env, wrapErrorHandler(wrapCircle)));
    
    // Crop module
    exports.Set(Napi::String::New(env, "crop"), Napi::Function::New(env, wrapErrorHandler(wrapCrop)));
    exports.Set(Napi::String::New(env, "autocrop"), Napi::Function::New(env, wrapErrorHandler(wrapAutocrop)));

    // Dither module
    exports.Set(Napi::String::New(env, "dither"), Napi::Function::New(env, wrapErrorHandler(wrapDither)));

    // Flip module
    exports.Set(Napi::String::New(env, "flip"), Napi::Function::New(env, wrapErrorHandler(wrapFlip)));

    // Mask module
    exports.Set(Napi::String::New(env, "mask"), Napi::Function::New(env, wrapErrorHandler(wrapMask)));

    // Invert module
    exports.Set(Napi::String::New(env, "invert"), Napi::Function::New(env, wrapErrorHandler(wrapInvert)));

    // Resize module
    exports.Set(Napi::String::New(env, "resize"), Napi::Function::New(env, wrapErrorHandler(wrapResize)));

    // Rotate module
    exports.Set(Napi::String::New(env, "rotate"), Napi::Function::New(env, wrapErrorHandler(wrapRotate)));

    return exports;
}

NODE_API_MODULE(JimpNativeCore, Init)
