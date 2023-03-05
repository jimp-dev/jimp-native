#include "wrapDither.hpp"
#include "dither.hpp"
#include "doAsync.hpp"
#include "nodeImage.hpp"

void wrapDither (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if(info.Length() < 3 || info.Length() > 4) {
        throw Napi::Error::New(env, "Invalid number of arguments");
    }

    if(!info[0].IsBuffer()) {
        throw Napi::Error::New(env, "Image has to be of type buffer");
    }

    if(!info[1].IsNumber()) {
        throw Napi::Error::New(env, "Image width has to be of type number");
    }

    if(!info[2].IsNumber()) {
        throw Napi::Error::New(env, "Image height has to be of type number");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 4 && info[3].IsFunction()) {
        callback = info[3].As<Napi::Function>();
    }

    Napi::Buffer<uint8_t> imageBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    size_t imageX = info[1].As<Napi::Number>().Int32Value();
    size_t imageY = info[2].As<Napi::Number>().Int32Value();

    Image image = NodeImage::fromJSBuffer(imageBuffer, env, imageX, imageY);

    if (callback) {
        auto imageBufferReference = referenceFactory.ref(env, imageBuffer);

        doAsync(
            env,
            callback.value(),
            [image = std::move(image)]() mutable {
                dither(image);
            },
            [imageBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                imageBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        dither(image);
    }
}
