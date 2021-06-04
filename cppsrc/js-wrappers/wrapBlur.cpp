#include "wrapBlur.hpp"
#include "../modules/blur.hpp"
#include "../util/doAsync.hpp"

void wrapBlur(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 4 || info.Length() > 5) {
        throw Napi::Error::New(env, "Invalid number of arguments");
    }

    if (!info[0].IsBuffer()) {
        throw Napi::Error::New(env, "Image has to be of type buffer");
    }

    if (!info[1].IsNumber()) {
        throw Napi::Error::New(env, "Image width has to be of type number");
    }

    if (!info[2].IsNumber()) {
        throw Napi::Error::New(env, "Image height has to be of type number");
    }

    if (!info[3].IsNumber()) {
        throw Napi::Error::New(env, "Radius has to be of type number");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 5 && info[4].IsFunction()) {
        callback = info[4].As<Napi::Function>();
    }

    Napi::Buffer<uint8_t> imageBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    size_t imageX = info[1].As<Napi::Number>().Int32Value();
    size_t imageY = info[2].As<Napi::Number>().Int32Value();

    Image image = Image::fromJSBuffer(imageBuffer, env, imageX, imageY);

    int radius = info[3].As<Napi::Number>().Int32Value();

    if (radius < 1) {
        throw Napi::Error::New(env, "Radius has to be more than 0.");
    }

    if (radius > 256) {
        throw Napi::Error::New(env, "Radius cannot be more than 256.");
    }

    if (callback) {
        auto imageBufferReference = referenceFactory.ref(env, imageBuffer);

        doAsync(
            env,
            callback.value(),
            [image = std::move(image), radius]() mutable {
                blur(image, radius);
            },
            [imageBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                imageBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        blur(image, radius);
    }
}