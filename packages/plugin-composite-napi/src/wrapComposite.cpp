#include "wrapComposite.hpp"
#include "composite.hpp"
#include "nodeImage.hpp"
#include "doAsync.hpp"

void wrapComposite (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 10 || info.Length() > 11) {
        throw Napi::Error::New(env, "Invalid number of arguments");
    }
    
    if (!info[0].IsBuffer()) {
        throw Napi::Error::New(env, "Source image must be of type Buffer");
    }
    
    if (!info[1].IsNumber()) {
        throw Napi::Error::New(env, "Source image width must be of type Number");
    }
    
    if (!info[2].IsNumber()) {
        throw Napi::Error::New(env, "Source image height must be of type Number");
    }
    
    if (!info[3].IsBuffer()) {
        throw Napi::Error::New(env, "Destination image must be of type Buffer");
    }
    
    if (!info[4].IsNumber()) {
        throw Napi::Error::New(env, "Destination image width must be of type Number");
    }
    
    if (!info[5].IsNumber()) {
        throw Napi::Error::New(env, "Destination image height must be of type Number");
    }
    
    if (!info[6].IsNumber()) {
        throw Napi::Error::New(env, "x must be of type Number");
    }
        
    if (!info[7].IsNumber()) {
        throw Napi::Error::New(env, "y must be of type Number");
    }
        
    if (!info[8].IsNumber()) {
        throw Napi::Error::New(env, "compositeMode must be of type Number");
    }
        
    if (!info[9].IsNumber()) {
        throw Napi::Error::New(env, "opacitySource must be of type Number");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 11 && info[10].IsFunction()) {
        callback = info[10].As<Napi::Function>();
    }
    
    Napi::Buffer<uint8_t> sourceImageBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    size_t sourceImageX = info[1].As<Napi::Number>().Int32Value();
    size_t sourceImageY = info[2].As<Napi::Number>().Int32Value();

    Image sourceImage = NodeImage::fromJSBuffer(sourceImageBuffer, env, sourceImageX, sourceImageY);
    
    Napi::Buffer<uint8_t> destImageBuffer = info[3].As<Napi::Buffer<uint8_t>>();
    size_t destImageX = info[4].As<Napi::Number>().Int32Value();
    size_t destImageY = info[5].As<Napi::Number>().Int32Value();
    
    Image destImage = NodeImage::fromJSBuffer(destImageBuffer, env, destImageX, destImageY);
    
    long x = info[6].As<Napi::Number>().Int32Value();
    long y = info[7].As<Napi::Number>().Int32Value();
    
    int32_t compositeModeNo = info[8].As<Napi::Number>().Int32Value();
    
    double opacitySource = info[9].As<Napi::Number>().DoubleValue();
    
    if (opacitySource < 0 || opacitySource > 1.0) {
        throw Napi::Error::New(env, "Opacity source must be in the range of 0 to 1");
    }
    
    CompositeMode compositeMode;
    switch(compositeModeNo) {
        case CompositeModes::BLEND_SOURCE_OVER:
            compositeMode = srcOver;
            break;
        case CompositeModes::BLEND_DESTINATION_OVER:
            compositeMode = dstOver;
            break;
        case CompositeModes::BLEND_MULTIPLY:
            compositeMode = multiply;
            break;
        case CompositeModes::BLEND_ADD:
            compositeMode = add;
            break;
        case CompositeModes::BLEND_SCREEN:
            compositeMode = screen;
            break;
        case CompositeModes::BLEND_OVERLAY:
            compositeMode = overlay;
            break;
        case CompositeModes::BLEND_DARKEN:
            compositeMode = darken;
            break;
        case CompositeModes::BLEND_LIGHTEN:
            compositeMode = lighten;
            break;
        case CompositeModes::BLEND_HARDLIGHT:
            compositeMode = hardLight;
            break;
        case CompositeModes::BLEND_DIFFERENCE:
            compositeMode = difference;
            break;
        case CompositeModes::BLEND_EXCLUSION:
            compositeMode = exclusion;
            break;
        default:
            throw Napi::Error::New(env, "Blendmode supplied does not exist");
    
    }
    
    if (callback) {
        auto sourceBufferReference = referenceFactory.ref(env, sourceImageBuffer);
        auto destBufferReference = referenceFactory.ref(env, destImageBuffer);

        doAsync(
            env,
            callback.value(),
            [
                sourceImage = std::move(sourceImage),
                destImage = std::move(destImage),
                x,
                y,
                compositeMode,
                opacitySource
            ]() mutable {
                composite(sourceImage, destImage, x, y, compositeMode, opacitySource);
            },
            [sourceBufferReference, destBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                sourceBufferReference.unref();
                destBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );        
    } else {
        composite(sourceImage, destImage, x, y, compositeMode, opacitySource);
    }
}
