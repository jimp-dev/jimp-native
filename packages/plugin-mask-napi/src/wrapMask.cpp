#include "wrapMask.hpp"
#include "mask.hpp"
#include "doAsync.hpp"
#include "nodeImage.hpp"

void wrapMask (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 8 || info.Length() > 9) {
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
        throw Napi::Error::New(env, "X offset must be of type Number");
    }
        
    if (!info[7].IsNumber()) {
        throw Napi::Error::New(env, "Y offset must be of type Number");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 9 && info[8].IsFunction()) {
        callback = info[8].As<Napi::Function>();
    }
    
    Napi::Buffer<uint8_t> sourceImageBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    size_t sourceImageX = info[1].As<Napi::Number>().Int32Value();
    size_t sourceImageY = info[2].As<Napi::Number>().Int32Value();

    Image sourceImage = NodeImage::fromJSBuffer(sourceImageBuffer, env, sourceImageX, sourceImageY);
    
    Napi::Buffer<uint8_t> destImageBuffer = info[3].As<Napi::Buffer<uint8_t>>();
    size_t destImageX = info[4].As<Napi::Number>().Int32Value();
    size_t destImageY = info[5].As<Napi::Number>().Int32Value();
    
    Image destImage = NodeImage::fromJSBuffer(destImageBuffer, env, destImageX, destImageY);
    
    long xOffset = info[6].As<Napi::Number>().Int32Value();
    long yOffset = info[7].As<Napi::Number>().Int32Value();

    if (callback) {
        auto sourceBufferReference = referenceFactory.ref(env, sourceImageBuffer);
        auto destBufferReference = referenceFactory.ref(env, destImageBuffer);

        doAsync(
            env,
            callback.value(),
            [sourceImage = std::move(sourceImage), destImage = std::move(destImage), xOffset, yOffset]() mutable {
                mask(sourceImage, destImage, xOffset, yOffset);
            },
            [sourceBufferReference, destBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                sourceBufferReference.unref();
                destBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );        
    } else {
        mask(sourceImage, destImage, xOffset, yOffset);
    }
}