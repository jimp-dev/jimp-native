#include "nodeImage.hpp"
#include "wrapColor.hpp"
#include "colour.hpp"
#include "doAsync.hpp"

void wrapBrightness(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 2 || info.Length() > 3) {
        throw Napi::Error::New(env, "Invalid number of arguments");
    }

    if (!info[0].IsBuffer()) {
        throw Napi::Error::New(env, "Image has to be of type buffer");
    }

    if (!info[1].IsNumber()) {
        throw Napi::Error::New(env, "Brightness has to be of type number");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 3 && info[2].IsFunction()) {
        callback = info[2].As<Napi::Function>();
    }

    double brightnessMultiplier = info[1].As<Napi::Number>().DoubleValue();
    if (brightnessMultiplier < -1 || brightnessMultiplier > 1) {
        throw Napi::Error::New(env, "Brightness has to be in the range of -1 to 1");
    }

    Napi::Buffer<uint8_t> buffer = info[0].As<Napi::Buffer<uint8_t>>();
    uint8_t* pixelData = buffer.Data();
    size_t bufferLength = buffer.ElementLength();

    if (bufferLength % 4 != 0) {
        throw Napi::Error::New(env, "Buffer length must be divisible by four (RGBA)");
    }

    if (callback) {
        auto imageBufferReference = referenceFactory.ref(env, buffer);

        doAsync(
            env,
            callback.value(),
            [pixelData, bufferLength, brightnessMultiplier]() mutable {
                brightness(pixelData, bufferLength, brightnessMultiplier);
            },
            [imageBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                imageBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        brightness(pixelData, bufferLength, brightnessMultiplier);
    }
}

void wrapOpacity(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 2 || info.Length() > 3) {
        throw Napi::Error::New(env, "Invalid number of arguments");
    }

    if (!info[0].IsBuffer()) {
        throw Napi::Error::New(env, "Image has to be of type buffer");
    }

    if (!info[1].IsNumber()) {
        throw Napi::Error::New(env, "Opacity has to be of type number");
    }

    double op = info[1].As<Napi::Number>().DoubleValue();
    if (op < 0 || op > 1) {
        throw Napi::Error::New(env, "Opacity has to be in the range from 0 to 1");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 3 && info[2].IsFunction()) {
        callback = info[2].As<Napi::Function>();
    }

    Napi::Buffer<uint8_t> buffer = info[0].As<Napi::Buffer<uint8_t>>();
    uint8_t* pixelData = buffer.Data();
    size_t bufferLength = buffer.ElementLength();

    if (bufferLength % 4 != 0) {
        throw Napi::Error::New(env, "Buffer length must be divisible by four (RGBA)");
    }

    if (callback) {
        auto imageBufferReference = referenceFactory.ref(env, buffer);

        doAsync(
            env,
            callback.value(),
            [pixelData, bufferLength, op]() mutable {
                opacity(pixelData, bufferLength, op);
            },
            [imageBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                imageBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        opacity(pixelData, bufferLength, op);
    }
}

void wrapOpaque(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || info.Length() > 2) {
        throw Napi::Error::New(env, "Invalid number of arguments");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 2 && info[1].IsFunction()) {
        callback = info[1].As<Napi::Function>();
    }

    Napi::Buffer<uint8_t> buffer = info[0].As<Napi::Buffer<uint8_t>>();
    uint8_t* pixelData = buffer.Data();
    size_t bufferLength = buffer.ElementLength();

    if (bufferLength % 4 != 0) {
        throw Napi::Error::New(env, "Buffer length must be divisible by four (RGBA)");
    }

    if (callback) {
        auto imageBufferReference = referenceFactory.ref(env, buffer);

        doAsync(
            env,
            callback.value(),
            [pixelData, bufferLength]() mutable {
                opaque(pixelData, bufferLength);
            },
            [imageBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                imageBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        opaque(pixelData, bufferLength);
    }
}

void wrapContrast(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 2 || info.Length() > 3) {
        throw Napi::Error::New(env, "Invalid number of arguments");
    }

    if (!info[0].IsBuffer()) {
        throw Napi::Error::New(env, "Image has to be of type buffer");
    }

    if (!info[1].IsNumber()) {
        throw Napi::Error::New(env, "Contrast has to be of type number");
    }

    double contr = info[1].As<Napi::Number>().DoubleValue();
    if (contr < -1 || contr > 1) {
        throw Napi::Error::New(env, "Contrast has to be in the range from -1 to 1");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 3 && info[2].IsFunction()) {
        callback = info[2].As<Napi::Function>();
    }

    Napi::Buffer<uint8_t> buffer = info[0].As<Napi::Buffer<uint8_t>>();
    uint8_t* pixelData = buffer.Data();
    size_t bufferLength = buffer.ElementLength();

    if (bufferLength % 4 != 0) {
        throw Napi::Error::New(env, "Buffer length must be divisible by four (RGBA)");
    }

    if (callback) {
        auto imageBufferReference = referenceFactory.ref(env, buffer);

        doAsync(
            env,
            callback.value(),
            [pixelData, bufferLength, contr]() mutable {
                contrast(pixelData, bufferLength, contr);
            },
            [imageBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                imageBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        contrast(pixelData, bufferLength, contr);
    }
}

void wrapPosterize(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 2 || info.Length() > 3) {
        throw Napi::Error::New(env, "Invalid number of arguments");
    }

    if (!info[0].IsBuffer()) {
        throw Napi::Error::New(env, "Image has to be of type buffer");
    }

    if (!info[1].IsNumber()) {
        throw Napi::Error::New(env, "Multiplier has to be of type number");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 3 && info[2].IsFunction()) {
        callback = info[2].As<Napi::Function>();
    }

    double multiplier = info[1].As<Napi::Number>().DoubleValue();

    Napi::Buffer<uint8_t> buffer = info[0].As<Napi::Buffer<uint8_t>>();
    uint8_t* pixelData = buffer.Data();
    size_t bufferLength = buffer.ElementLength();

    if (bufferLength % 4 != 0) {
        throw Napi::Error::New(env, "Buffer length must be divisible by four (RGBA)");
        return;
    }

    if (callback) {
        auto imageBufferReference = referenceFactory.ref(env, buffer);

        doAsync(
            env,
            callback.value(),
            [pixelData, bufferLength, multiplier]() mutable {
                posterize(pixelData, bufferLength, multiplier);
            },
            [imageBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                imageBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        posterize(pixelData, bufferLength, multiplier);
    }
}

void wrapSepia(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || info.Length() > 2) {
        throw Napi::Error::New(env, "Invalid number of arguments");
    }

    if (!info[0].IsBuffer()) {
        throw Napi::Error::New(env, "Image has to be of type buffer");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 2 && info[1].IsFunction()) {
        callback = info[1].As<Napi::Function>();
    }

    Napi::Buffer<uint8_t> buffer = info[0].As<Napi::Buffer<uint8_t>>();
    uint8_t* pixelData = buffer.Data();
    size_t bufferLength = buffer.ElementLength();

    if (bufferLength % 4 != 0) {
        throw Napi::Error::New(env, "Buffer length must be divisible by four (RGBA)");
    }

    if (callback) {
        auto imageBufferReference = referenceFactory.ref(env, buffer);

        doAsync(
            env,
            callback.value(),
            [pixelData, bufferLength]() mutable {
                sepia(pixelData, bufferLength);
            },
            [imageBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                imageBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        sepia(pixelData, bufferLength);
    }
}

void wrapGreyscale(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || info.Length() > 2) {
        throw Napi::Error::New(env, "Invalid number of arguments");
    }

    if (!info[0].IsBuffer()) {
        throw Napi::Error::New(env, "Image has to be of type buffer");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 2 && info[1].IsFunction()) {
        callback = info[1].As<Napi::Function>();
    }

    Napi::Buffer<uint8_t> buffer = info[0].As<Napi::Buffer<uint8_t>>();
    uint8_t* pixelData = buffer.Data();
    size_t bufferLength = buffer.ElementLength();

    if (bufferLength % 4 != 0) {
        throw Napi::Error::New(env, "Buffer length must be divisible by four (RGBA)");
    }

    if (callback) {
        auto imageBufferReference = referenceFactory.ref(env, buffer);

        doAsync(
            env,
            callback.value(),
            [pixelData, bufferLength]() mutable {
                greyscale(pixelData, bufferLength);
            },
            [imageBufferReference](Napi::Env env, Napi::Function callback, auto err) mutable {
                imageBufferReference.unref();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        greyscale(pixelData, bufferLength);   
    }
}


void wrapConvolution(const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory) {
    Napi::Env env = info.Env();

    if (info.Length() < 10 || info.Length() > 11) {
        throw Napi::Error::New(env, "Invalid number of arguments");
    }

    if (!info[0].IsBuffer()) {
        throw Napi::Error::New(env, "Image has to be of type buffer");
    }

    if (!info[1].IsNumber()) {
        throw Napi::Error::New(env, "Image width has to be of type Number");
    }

    if (!info[2].IsNumber()) {
        throw Napi::Error::New(env, "Image height has to be of type Number");
    }

    if (!info[3].IsArray()) {
        throw Napi::Error::New(env, "Kernel must be a 2D array of numbers");
    }

    if (!info[4].IsNumber()) {
        throw Napi::Error::New(env, "Edgehandling must be of type Number");
    }

    if (!info[5].IsNumber()) {
        throw Napi::Error::New(env, "X offset must be of type Number");
    }

    if (!info[6].IsNumber()) {
        throw Napi::Error::New(env, "Y offset must be of type Number");
    }

    if (!info[7].IsNumber()) {
        throw Napi::Error::New(env, "Width must be of type Number");
    }

    if (!info[8].IsNumber()) {
        throw Napi::Error::New(env, "Height must be of type Number");
    }

    if (!info[9].IsNumber()) {
        throw Napi::Error::New(env, "Size must be of type Number");
    }

    std::optional<Napi::Function> callback;
    if (info.Length() == 11 && info[10].IsFunction()) {
        callback = info[10].As<Napi::Function>();
    }

    long xOffset = info[5].As<Napi::Number>().Int32Value();
    long yOffset = info[6].As<Napi::Number>().Int32Value();
    long regionWidth = info[7].As<Napi::Number>().Int32Value();
    long regionHeight = info[8].As<Napi::Number>().Int32Value();
    double size = info[9].As<Napi::Number>().DoubleValue();

    Napi::Buffer<uint8_t> buffer = info[0].As<Napi::Buffer<uint8_t>>();
    size_t x = info[1].As<Napi::Number>().Int32Value();
    size_t y = info[2].As<Napi::Number>().Int32Value();

    Image targetImage = NodeImage::fromJSBuffer(buffer, env, x, y);
    Image sourceImage = targetImage.clone();

    Napi::Array jsKernel = info[3].As<Napi::Array>();
    unsigned int kernelHeight = jsKernel.Length();
    if (kernelHeight == 0) {
        throw Napi::Error::New(env, "Kernel has to be at least 1 high");
    }

    unsigned int kernelRowsAllocated = 0;
    double** kernel = new double* [kernelHeight];
    auto deleteKernel = [kernelRowsAllocated, kernel]() {
        for (unsigned int i = 0; kernelRowsAllocated > i; i++) {
            delete[] kernel[i];
        }

        delete[] kernel;
    };

    unsigned int kernelWidth = 1;
    for (unsigned int y = 0; kernelHeight > y; y++) {
        Napi::Value rowVal = jsKernel.Get(y);

        if (!rowVal.IsArray()) {
            deleteKernel();
            throw Napi::Error::New(env, "Kernel must be a 2D array of numbers");
        }

        Napi::Array row = rowVal.As<Napi::Array>();

        if (y == 0) {
            kernelWidth = row.Length();
            if (kernelWidth == 0) {
                deleteKernel();
                throw Napi::Error::New(env, "Kernel width must be at least 1");
            }
        } else {
            if (row.Length() != kernelWidth) {
                deleteKernel();
                throw Napi::Error::New(env, "Kernel rows must be of equal size");
            }
        }

        kernel[y] = new double[kernelWidth];
        kernelRowsAllocated++;
        for (unsigned int x = 0; kernelWidth > x; x++) {
            Napi::Value elementVal = row.Get(x);
            if (!elementVal.IsNumber()) {
                deleteKernel();
                throw Napi::Error::New(env, "Kernel must be a 2D array of numbers");
            }

            kernel[y][x] = elementVal.As<Napi::Number>().DoubleValue();
        }
    }

    EdgeHandling edgeHandling = (EdgeHandling) info[4].As<Napi::Number>().Uint32Value();

    if (callback) {
        auto bufferReference = referenceFactory.ref(env, buffer);

        doAsync(
            env,
            callback.value(),
            [
                sourceImage = std::move(sourceImage),
                targetImage = std::move(targetImage),
                kernel,
                kernelWidth,
                kernelHeight,
                xOffset,
                yOffset,
                regionWidth,
                regionHeight,
                edgeHandling,
                size
            ]() mutable {
                    convolution(
                        sourceImage,
                        targetImage,
                        kernel,
                        kernelWidth,
                        kernelHeight,
                        xOffset,
                        yOffset,
                        regionWidth,
                        regionHeight,
                        edgeHandling,
                        size
                    );
            },
            [bufferReference, deleteKernel = std::move(deleteKernel)](Napi::Env env, Napi::Function callback, auto err) mutable {
                bufferReference.unref();
                deleteKernel();
                callback.Call({ err ? Napi::String::New(env, err.value()) : env.Null() });
            }
        );
    } else {
        convolution(
            sourceImage,
            targetImage,
            kernel,
            kernelWidth,
            kernelHeight,
            xOffset,
            yOffset,
            regionWidth,
            regionHeight,
            edgeHandling,
            size
        );

        deleteKernel();
    }

}
