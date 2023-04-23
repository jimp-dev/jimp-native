#include "wrapRotate.hpp"
#include "rotate.hpp"
#include "doAsync.hpp"
#include "nodeImage.hpp"

void wrapAdvancedRotate(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
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

    Image sourceImage = NodeImage::fromJSBuffer(sourceImageBuffer, env, sourceImageX, sourceImageY);

    double degrees = info[3].As<Napi::Number>().DoubleValue();

    if (callback) {
        auto sourceBufferReference = referenceFactory.ref(env, sourceImageBuffer);

        doAsync(
            env,
            callback.value(),
            [sourceImage = std::move(sourceImage), degrees]() mutable {
                advancedRotate(sourceImage, degrees);
            },
            [sourceBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                sourceBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
            );
    } else {
        advancedRotate(sourceImage, degrees);
    }
}

void wrapMatrixRotate(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 7 || info.Length() > 8) {
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
        throw Napi::Error::New(env, "Degrees must be of type Number");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 8 && info[7].IsFunction()) {
        callback = info[7].As<Napi::Function>();
    }

    Napi::Buffer<uint8_t> sourceImageBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    size_t sourceImageX = info[1].As<Napi::Number>().Int32Value();
    size_t sourceImageY = info[2].As<Napi::Number>().Int32Value();

    Image sourceImage = NodeImage::fromJSBuffer(sourceImageBuffer, env, sourceImageX, sourceImageY);

    Napi::Buffer<uint8_t> destinationImageBuffer = info[3].As<Napi::Buffer<uint8_t>>();
    size_t destinationImageX = info[4].As<Napi::Number>().Int32Value();
    size_t destinationImageY = info[5].As<Napi::Number>().Int32Value();

    Image destinationImage = NodeImage::fromJSBuffer(destinationImageBuffer, env, destinationImageX, destinationImageY);

    int degrees = info[6].As<Napi::Number>().Int32Value();
    if (degrees < 0 || degrees > 360 || degrees % 90 > 0) {
        throw Napi::Error::New(env, "Degrees must be within 0 to 360 and has to be a multiple of 90");
    }

    size_t expectedWidth = degrees % 180 == 90
        ? sourceImage.height
        : sourceImage.width;

    size_t expectedHeight = degrees % 180 == 90
        ? sourceImage.width
        : sourceImage.height;

    if (destinationImageX != expectedWidth) {
        throw Napi::Error::New(env, "Destination image has incorrect width!");
    }

    if (destinationImageY != expectedHeight) {
        throw Napi::Error::New(env, "Destination image has incorrect height!");
    }

    if (callback) {
        auto sourceBufferReference = referenceFactory.ref(env, sourceImageBuffer);
        auto destinationBufferReference = referenceFactory.ref(env, destinationImageBuffer);

        doAsync(
            env,
            callback.value(),
            [
                sourceImage = std::move(sourceImage),
                destinationImage = std::move(destinationImage),
                degrees
            ]() mutable {
                matrixRotate(sourceImage, destinationImage, degrees);
            },
            [
                sourceBufferReference,
                destinationBufferReference
            ](Napi::Env env, Napi::Function callback, auto err) mutable {
                sourceBufferReference.unref();
                destinationBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            });
    } else {
        matrixRotate(sourceImage, destinationImage, degrees);
    }
}