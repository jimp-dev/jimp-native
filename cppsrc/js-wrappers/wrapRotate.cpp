#include "wrapRotate.hpp"
#include "../modules/rotate.hpp"
#include "../util/doAsync.hpp"

void wrapRotate (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 4 || info.Length() > 5) {
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
    
    if (!info[3].IsNumber()) {
        throw Napi::Error::New(env, "Degrees must be of type Number");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 5 && info[4].IsFunction()) {
        callback = info[4].As<Napi::Function>();
    }

    Napi::Buffer<uint8_t> sourceImageBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    size_t sourceImageX = info[1].As<Napi::Number>().Int32Value();
    size_t sourceImageY = info[2].As<Napi::Number>().Int32Value();

    Image sourceImage = Image::fromJSBuffer(sourceImageBuffer, env, sourceImageX, sourceImageY);
    
    double degrees = info[3].As<Napi::Number>().DoubleValue();

    if (callback) {
        auto sourceBufferReference = referenceFactory.ref(env, sourceImageBuffer);

        doAsync(
            env,
            callback.value(),
            [sourceImage = std::move(sourceImage), degrees]() mutable {
                rotate(sourceImage, degrees);
            },
            [sourceBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                sourceBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        rotate(sourceImage, degrees);
    }
}