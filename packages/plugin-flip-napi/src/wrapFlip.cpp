#include "wrapFlip.hpp"
#include "flip.hpp"
#include "doAsync.hpp"
#include "nodeImage.hpp"

void wrapFlip (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if(info.Length() < 5 || info.Length() > 6) {
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

    if(!info[3].IsBoolean()) {
        throw Napi::Error::New(env, "Horizontally must be of type boolean");
    }

    if(!info[4].IsBoolean()) {
        throw Napi::Error::New(env, "Vertically must be of type boolean");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 6 && info[5].IsFunction()) {
        callback = info[5].As<Napi::Function>();
    }

    Napi::Buffer<uint8_t> imageBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    size_t imageX = info[1].As<Napi::Number>().Int32Value();
    size_t imageY = info[2].As<Napi::Number>().Int32Value();

    Image image = NodeImage::fromJSBuffer(imageBuffer, env, imageX, imageY);

    bool horizontally = info[3].As<Napi::Boolean>();
    bool vertically = info[4].As<Napi::Boolean>();

    if (callback) {
        auto imageBufferReference = referenceFactory.ref(env, imageBuffer);

        doAsync(
            env,
            callback.value(),
            [image = std::move(image), horizontally, vertically]() mutable {
                flip(image, horizontally, vertically);
            },
            [imageBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                imageBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        flip(image, horizontally, vertically);
    }
}
