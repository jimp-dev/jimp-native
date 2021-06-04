#include "wrapCirlce.hpp"
#include "../modules/circle.hpp"
#include "../util/doAsync.hpp"

void wrapCircle(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 6 || info.Length() > 7) {
        throw Napi::Error::New(env, "Invalid number of arguments");
    }

    if (!info[0].IsBuffer()) {
        throw Napi::Error::New(env, "Image must be of type Buffer");
    }

    if (!info[1].IsNumber()) {
        throw Napi::Error::New(env, "Image width must be of type Number");
    }

    if (!info[2].IsNumber()) {
        throw Napi::Error::New(env, "Image height must be of type Number");
    }

    if (!info[3].IsNumber()) {
        throw Napi::Error::New(env, "Radius must be of type Number");
    }

    if (!info[4].IsNumber()) {
        throw Napi::Error::New(env, "Centre X must be of type Number");
    }

    if (!info[5].IsNumber()) {
        throw Napi::Error::New(env, "Centre Y must be of type Number");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 7 && info[6].IsFunction()) {
        callback = info[6].As<Napi::Function>();
    }


    Napi::Buffer<uint8_t> imageBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    size_t imageX = info[1].As<Napi::Number>().Int32Value();
    size_t imageY = info[2].As<Napi::Number>().Int32Value();

    Image image = Image::fromJSBuffer(imageBuffer, env, imageX, imageY);

    long radius = info[3].As<Napi::Number>().Int32Value();
    long centreX = info[4].As<Napi::Number>().Int32Value();
    long centreY = info[5].As<Napi::Number>().Int32Value();

    if (callback) {
        auto imageBufferReference = referenceFactory.ref(env, imageBuffer);

        doAsync(
            env,
            callback.value(),
            [image = std::move(image), radius, centreX, centreY]() mutable {
                circle(image, radius, centreX, centreY);
            },
            [imageBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                imageBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        circle(image, radius, centreX, centreY);
    }
}
