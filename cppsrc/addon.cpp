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

typedef void (*WrapperFunction) (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);

/**
 * Wraps a wrapper function (yes) in a generic error handler that bubbles JS errors thrown by C++ up to JavaScript land.
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

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    ReferenceFactory* referenceFactory = new ReferenceFactory();

    // Compositing module
    exports.Set(Napi::String::New(env, "composite"), Napi::Function::New(env, wrapErrorHandler(wrapComposite, *referenceFactory)));

    // Colour module
    exports.Set(Napi::String::New(env, "opacity"), Napi::Function::New(env, wrapErrorHandler(wrapOpacity, *referenceFactory)));
    exports.Set(Napi::String::New(env, "opaque"), Napi::Function::New(env, wrapErrorHandler(wrapOpaque, *referenceFactory)));
    exports.Set(Napi::String::New(env, "brightness"), Napi::Function::New(env, wrapErrorHandler(wrapBrightness, *referenceFactory)));
    exports.Set(Napi::String::New(env, "contrast"), Napi::Function::New(env, wrapErrorHandler(wrapContrast, *referenceFactory)));
    exports.Set(Napi::String::New(env, "posterize"), Napi::Function::New(env, wrapErrorHandler(wrapPosterize, *referenceFactory)));
    exports.Set(Napi::String::New(env, "sepia"), Napi::Function::New(env, wrapErrorHandler(wrapSepia, *referenceFactory)));
    exports.Set(Napi::String::New(env, "convolution"), Napi::Function::New(env, wrapErrorHandler(wrapConvolution, *referenceFactory)));
    exports.Set(Napi::String::New(env, "greyscale"), Napi::Function::New(env, wrapErrorHandler(wrapGreyscale, *referenceFactory)));

    // Blit module
    exports.Set(Napi::String::New(env, "blit"), Napi::Function::New(env, wrapErrorHandler(wrapBlit, *referenceFactory)));

    // Blur module
    exports.Set(Napi::String::New(env, "blur"), Napi::Function::New(env, wrapErrorHandler(wrapBlur, *referenceFactory)));

    // Circle module
    exports.Set(Napi::String::New(env, "circle"), Napi::Function::New(env, wrapErrorHandler(wrapCircle, *referenceFactory)));
    
    // Crop module
    exports.Set(Napi::String::New(env, "crop"), Napi::Function::New(env, wrapErrorHandler(wrapCrop, *referenceFactory)));
    exports.Set(Napi::String::New(env, "autocrop"), Napi::Function::New(env, wrapErrorHandler(wrapAutocrop, *referenceFactory)));

    // Dither module
    exports.Set(Napi::String::New(env, "dither"), Napi::Function::New(env, wrapErrorHandler(wrapDither, *referenceFactory)));

    // Flip module
    exports.Set(Napi::String::New(env, "flip"), Napi::Function::New(env, wrapErrorHandler(wrapFlip, *referenceFactory)));

    // Mask module
    exports.Set(Napi::String::New(env, "mask"), Napi::Function::New(env, wrapErrorHandler(wrapMask, *referenceFactory)));

    // Invert module
    exports.Set(Napi::String::New(env, "invert"), Napi::Function::New(env, wrapErrorHandler(wrapInvert, *referenceFactory)));

    // Resize module
    exports.Set(Napi::String::New(env, "resize"), Napi::Function::New(env, wrapErrorHandler(wrapResize, *referenceFactory)));

    // Rotate module
    exports.Set(Napi::String::New(env, "rotate"), Napi::Function::New(env, wrapErrorHandler(wrapRotate, *referenceFactory)));

    exports.AddFinalizer([](Napi::Env env, ReferenceFactory* referenceFactory) {

        delete referenceFactory;
    }, referenceFactory);

    return exports;
}

NODE_API_MODULE(JimpNativeCore, Init)
