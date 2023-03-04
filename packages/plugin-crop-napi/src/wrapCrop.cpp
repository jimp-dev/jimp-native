#include "wrapCrop.hpp"
#include "crop.hpp"
#include "doAsync.hpp"
#include "nodeImage.hpp"

void wrapCrop(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 7 || info.Length() > 8) {
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
        throw Napi::Error::New(env, "X offset must be of type Number");
    }

    if (!info[4].IsNumber()) {
        throw Napi::Error::New(env, "Y offset must be of type Number");
    }

    if (!info[5].IsNumber()) {
        throw Napi::Error::New(env, "Crop width must be of type Number");
    }

    if (!info[6].IsNumber()) {
        throw Napi::Error::New(env, "Crop height must be of type Number");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 8 && info[7].IsFunction()) {
        callback = info[7].As<Napi::Function>();
    }

    Napi::Buffer<uint8_t> imageBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    size_t imageX = info[1].As<Napi::Number>().Int32Value();
    size_t imageY = info[2].As<Napi::Number>().Int32Value();

    Image image = NodeImage::fromJSBuffer(imageBuffer, env, imageX, imageY);

    long xOffset = info[3].As<Napi::Number>().Int32Value();
    long yOffset = info[4].As<Napi::Number>().Int32Value();
    long width = info[5].As<Napi::Number>().Int32Value();
    long height = info[6].As<Napi::Number>().Int32Value();

    if (callback) {
        auto bufferReference = referenceFactory.ref(env, imageBuffer);

        doAsync(
            env,
            callback.value(),
            [image = std::move(image), xOffset, yOffset, width, height]() mutable {
            crop(image, xOffset, yOffset, width, height);
        },
            [bufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
            bufferReference.unref();
            callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
        }
        );
    } else {
        crop(image, xOffset, yOffset, width, height);
    }
}

void wrapAutocrop(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 12 || info.Length() > 13) {
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
        throw Napi::Error::New(env, "Leave border must be of type Number");
    }

    if (!info[4].IsNumber()) {
        throw Napi::Error::New(env, "Tolerance offset must be of type Number");
    }

    if (!info[5].IsBoolean()) {
        throw Napi::Error::New(env, "Crop only frames must be of type Boolean");
    }

    if (!info[6].IsBoolean()) {
        throw Napi::Error::New(env, "Symmetric must be of type Boolean");
    }

    if (!info[7].IsBoolean()) {
        throw Napi::Error::New(env, "North must be of type Boolean");
    }

    if (!info[8].IsBoolean()) {
        throw Napi::Error::New(env, "East must be of type Boolean");
    }

    if (!info[9].IsBoolean()) {
        throw Napi::Error::New(env, "South must be of type Boolean");
    }

    if (!info[10].IsBoolean()) {
        throw Napi::Error::New(env, "West must be of type Boolean");
    }

    if (!info[11].IsObject()) {
        throw Napi::Error::New(env, "Bitmap must be of type Object");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 13 && info[12].IsFunction()) {
        callback = info[12].As<Napi::Function>();
    }

    Napi::Buffer<uint8_t> imageBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    size_t imageX = info[1].As<Napi::Number>().Int32Value();
    size_t imageY = info[2].As<Napi::Number>().Int32Value();

    Image image = NodeImage::fromJSBuffer(imageBuffer, env, imageX, imageY);

    long leaveBorder = info[3].As<Napi::Number>().Int32Value();
    double tolerance = info[4].As<Napi::Number>().DoubleValue();
    bool cropOnlyFrames = info[5].As<Napi::Boolean>();
    bool symmetric = info[6].As<Napi::Boolean>();
    bool north = info[7].As<Napi::Boolean>();
    bool east = info[8].As<Napi::Boolean>();
    bool south = info[9].As<Napi::Boolean>();
    bool west = info[10].As<Napi::Boolean>();

    Napi::Object bitmap = info[11].As<Napi::Object>();

    if (callback) {
        auto imageBufferReference = referenceFactory.ref(env, imageBuffer);
        
        long* newWidth = new long;
        long* newHeight = new long;

        doAsync(
            env,
            callback.value(),
            [
                image = std::move(image),
                leaveBorder,
                tolerance,
                cropOnlyFrames,
                symmetric,
                north,
                east,
                south,
                west,
                newWidth,
                newHeight
            ]() mutable {
                autocrop(
                    image,
                    leaveBorder,
                    tolerance,
                    cropOnlyFrames,
                    symmetric,
                    north,
                    east,
                    south,
                    west,
                    *newWidth,
                    *newHeight
                );
            },
            [
                imageBufferReference,
                bitmap = std::move(bitmap),
                newWidth,
                newHeight
            ](Napi::Env env, Napi::Function callback, auto err) mutable {
                auto jsNewWidth = Napi::Number::New(env, *newWidth);
                auto jsNewHeight = Napi::Number::New(env, *newHeight);
                delete newWidth;
                delete newHeight;
                imageBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null(), jsNewWidth, jsNewHeight });
            }
        );
    } else {
        long newWidth = image.width;
        long newHeight = image.height;

        autocrop(
            image,
            leaveBorder,
            tolerance,
            cropOnlyFrames,
            symmetric,
            north,
            east,
            south,
            west,
            newWidth,
            newHeight
        );

        bitmap.Set(Napi::String::New(env, "width"), Napi::Number::New(env, newWidth));
        bitmap.Set(Napi::String::New(env, "height"), Napi::Number::New(env, newHeight));
    }
}
