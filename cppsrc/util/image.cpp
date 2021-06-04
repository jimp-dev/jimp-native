#include "image.hpp"
#include <cmath>
#include <iostream>
#include <limits.h>

/**
 * Checks if with and height values are safe to use on this system.
 *
 * \param width
 * \param height
 *
 * \throws out_of_range
 */
void sizeSanityCheck(long width, long height) {
    if (width < 1 || height < 1) {
        throw std::out_of_range("Width and height must not be zero.");
    }

    long byteCount = width * height * 4;

    if (byteCount > LONG_MAX) {
        throw std::out_of_range("Byte count may not exceed platform LONG_MAX.");
    }
}

Image::Image(uint8_t* imageData, long width, long height, size_t pixelCount, bool memoryManagedExternally) :
    imageData(imageData),
    width(width),
    height(height),
    pixelCount(pixelCount),
    rgbaArrayLength(pixelCount * 4),
    memoryManagedExternally(memoryManagedExternally) {
};

Image::Image(Image&& img) :
    width(img.width),
    height(img.height),
    pixelCount(img.pixelCount),
    rgbaArrayLength(img.rgbaArrayLength),
    memoryManagedExternally(img.memoryManagedExternally) {
    if (img.memoryManagedExternally) {
        imageData = img.imageData;
    } else {
        img.moved = true;
        imageData = img.imageData;
    }
}

Image::Image(const Image& img) :
    width(img.width),
    height(img.height),
    pixelCount(img.pixelCount),
    rgbaArrayLength(img.rgbaArrayLength),
    memoryManagedExternally(img.memoryManagedExternally) {
    if (img.memoryManagedExternally) {
        imageData = img.imageData;
    } else {
        imageData = new uint8_t[img.pixelCount * 4];
        std::copy(imageData, imageData + img.pixelCount * 4, imageData);
    }
}

Image::Image(long width, long height) :
    width(width),
    height(height),
    pixelCount(width* height),
    rgbaArrayLength(width* height * 4),
    memoryManagedExternally(false) {
    sizeSanityCheck(width, height);
    imageData = new uint8_t[width * height * 4];
}

Image Image::clone() {
    uint8_t* imageDataCopy = new uint8_t[pixelCount * 4];

    std::copy(imageData, imageData + pixelCount * 4, imageDataCopy);

    return Image(imageDataCopy, width, height, pixelCount, false);
}

Image Image::createEmpty(size_t width, size_t height) {
    sizeSanityCheck(width, height);

    uint8_t* imageData = new uint8_t[width * height * 4];

    return Image(imageData, width, height, width * height, false);
}

Image Image::fromJSBuffer(Napi::Buffer<uint8_t>& buffer, Napi::Env& env, size_t width, size_t height) {
    sizeSanityCheck(width, height);

    uint8_t* array = buffer.Data();
    size_t pixelCount = buffer.ElementLength() / 4;

    if (pixelCount != (width * height)) {
        throw Napi::Error::New(env, "Width and height do not match supplied buffer.");
    }

    return Image(array, width, height, pixelCount, buffer);
}

long Image::getPixelIndex(long x, long y, EdgeHandling edgeHandling) {
    switch (edgeHandling) {
        default:
        case EDGE_CROP: {
            if (x > -1 && y > -1 && x < width && y < height) {
                return (y * width + x) * 4;
            }

            return -1;
        }
        case EDGE_EXTEND: {
            x = std::max(0l, std::min(x, width - 1));
            y = std::max(0l, std::min(y, height - 1));

            return (y * width + x) * 4;
        }
        case EDGE_WRAP: {
            if (x < 0) {
                x += width;
            } else if (x >= width) {
                x %= width;
            }

            if (y < 0) {
                y += height;
            } else if (y >= height) {
                y %= height;
            }

            return (y * width + x) * 4;
        }
    }
}

uint8_t* Image::getPixelAt(long x, long y, EdgeHandling edgeHandling, uint8_t* none) {
    long index = getPixelIndex(x, y, edgeHandling);

    if (index == -1) {
        return none;
    }

    return imageData + index;
}

void Image::getColourAt(long x, long y, ColourFP& colour, EdgeHandling edgeHandling) {
    uint8_t* pixel = getPixelAt(x, y, edgeHandling);

    if (pixel == nullptr) {
        colour.r = -1.0;
        colour.g = -1.0;
        colour.b = -1.0;
        colour.a = -1.0;
        return;
    }

    colour.r = pixel[0] / 255.0;
    colour.g = pixel[1] / 255.0;
    colour.b = pixel[2] / 255.0;
    colour.a = pixel[3] / 255.0;
}

void Image::setColourAt(long x, long y, ColourFP colour, EdgeHandling edgeHandling) {
    clipColour(colour);

    uint8_t* pixel = getPixelAt(x, y, edgeHandling);

    if (pixel == nullptr) {
        return;
    }

    pixel[0] = colour.r * 255.0;
    pixel[1] = colour.g * 255.0;
    pixel[2] = colour.b * 255.0;
    pixel[3] = colour.a * 255.0;
}

void Image::clear() {
    std::fill_n(imageData, pixelCount * 4, 0);
}

void Image::iterate(const std::function <void(long x, long y, uint8_t* pixel)>& callback) {
    long pixelOffset = 0;
    for (long y = 0; height > y; y++) {
        for (long x = 0; width > x; x++) {
            callback(x, y, imageData + pixelOffset);
            pixelOffset += 4;
        }
    }
}

uint8_t* Image::getPixels() {
    return imageData;
}

uint8_t& Image::operator[] (long i) {
    if (i >= 0 && i < rgbaArrayLength) {
        return imageData[i];
    }

    throw std::out_of_range("Received index outside of image range.");
}

Image::~Image() {
    // Clean up if this is a copy. If the uint8_t array is from a Napi::Buffer then JavaScript's GC will take care of it.
    if (!memoryManagedExternally && !moved) {
        delete[] imageData;
    }
}
