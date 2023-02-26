#pragma once
#include "colourUtil.hpp"
#include <napi.h>
#include <optional>
#include <limits.h>
#include <cmath>
#include <iostream>

enum EdgeHandling {
    EDGE_EXTEND = 1,
    EDGE_WRAP = 2,
    EDGE_CROP = 3,
};

/**
 * The image class provides a thin wrapper for working on top of RGBA arrays with various degrees of safety.
 *
 * Using the [] operator on an image instance gives you direct access to the RGBA array of the image and handles bounds
 * checking for you, throwing std::out_of_range if an out of range index is given.
 *
 * getPixelAt is probably the easiest way to access image data, letting you specify x, y coordinates and edge handling
 * behaviour. This method is preferred unless direct image data access gives considerable performance benefits.
 *
 * The getPixels method gives you a pointer to the start of the RGBA image data. Using this to operate on image memory
 * is risky as there's zero bounds checking and should only be done when it's:
 *    a) greatly beneficial to performance,
 *    b) 100% safe to do so (reading/writing should be straightforward and depend on simple, integer arithmetic)
 *
 * getColourAt and setColourAt are useful if you are implementing an algorithm that heavily relies on floating point
 * arithmetic. These functions handle the conversions to and from 8 bit colour components to 0 - 1 doubles.
 */
class Image {
protected:
    Image(uint8_t* imageData, long width, long height, size_t pixelCount, bool memoryManagedExternally):
        imageData(imageData),
        width(width),
        height(height),
        pixelCount(pixelCount),
        rgbaArrayLength(pixelCount * 4),
        memoryManagedExternally(memoryManagedExternally) {
    }

    uint8_t* imageData;

public:
    Image() = delete;

    Image(long width, long height):
        width(width),
        height(height),
        pixelCount(width* height),
        rgbaArrayLength(width* height * 4),
        memoryManagedExternally(false) {
        Image::sizeSanityCheck(width, height);
        imageData = new uint8_t[width * height * 4];
    }

    Image(const Image& img):
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

    Image(Image&& img):
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

    const long width;
    const long height;
    const size_t pixelCount;
    const long rgbaArrayLength;
    const bool memoryManagedExternally;
    bool moved = false;

    /**
     * Returns a clone of the image that doesn't affect JavaScript memory.
     *
     **/
    Image clone() {
        uint8_t* imageDataCopy = new uint8_t[pixelCount * 4];

        std::copy(imageData, imageData + pixelCount * 4, imageDataCopy);

        return Image(imageDataCopy, width, height, pixelCount, false);
    }

    /**
     * Creates an empty image outside of JavaScript memory.
     *
     * \param width
     * \param height
     **/
    static Image createEmpty(size_t width, size_t height) {
        Image::sizeSanityCheck(width, height);

        uint8_t* imageData = new uint8_t[width * height * 4];

        return Image(imageData, width, height, width * height, false);
    }


    /**
     * Checks if with and height values are safe to use on this system.
     *
     * \param width
     * \param height
     *
     * \throws out_of_range
     */
    static void sizeSanityCheck(long width, long height) {
        if (width < 1 || height < 1) {
            throw std::out_of_range("Width and height must not be zero.");
        }

        long byteCount = width * height * 4;

        if (byteCount > LONG_MAX) {
            throw std::out_of_range("Byte count may not exceed platform LONG_MAX.");
        }
    }

    /**
     * Returns the index of the pixel in the backing RGBA image data, starting at the red component. Returns -1 if
     * out of bounds with EDGE_CROP on.
     *
     * \param x
     * \param y
     * \param edgeHandling
     **/
    long getPixelIndex(long x, long y, EdgeHandling edgeHandling = EDGE_CROP) {
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
                    x = (x % width + width) % width;
                } else if (x >= width) {
                    x %= width;
                }

                if (y < 0) {
                    y = (y % height + height) % height;
                } else if (y >= height) {
                    y %= height;
                }

                return (y * width + x) * 4;
            }
        }
    }

    /**
     * Returns a pointer to the RGBA components in memory. Returns none parameter if out of bounds (nullptr by default).
     *
     * \param x
     * \param y
     * \param edgeHandling
     * \param none
     *
     **/
    uint8_t* getPixelAt(long x, long y, EdgeHandling edgeHandling = EDGE_CROP, uint8_t* none = nullptr) {
        long index = getPixelIndex(x, y, edgeHandling);

        if (index < 0 || index >= rgbaArrayLength) {
            return none;
        }

        return imageData + index;
    }

    /**
     * Sets a ColourFP to the value of the pixel at the specified location. Sets with all components to -1 if no pixel
     * was found at the given coordinates.
     *
     * \param x
     * \param y
     * \param colour
     * \param edgeHandling
     **/
    void getColourAt(long x, long y, ColourFP& colour, EdgeHandling edgeHandling = EDGE_CROP) {
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

    /**
     * Sets the pixel at the given location to the given colour. Handles clipping the colour components as well.
     *
     * \param x
     * \param y
     * \param edgeHandling
     **/
    void setColourAt(long x, long y, ColourFP colour, EdgeHandling edgeHandling = EDGE_CROP) {
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

    /**
     * Clears the image, setting the bitmap to all zeroes.
     **/
    void clear() {
        std::fill_n(imageData, pixelCount * 4, 0);
    }

    /**
     * Iterates over every pixel in the image, calling the provided function with x, y and pixel data.
     **/
    void iterate(const std::function <void(long x, long y, uint8_t* pixel)>& callback) {
        long pixelOffset = 0;
        for (long y = 0; height > y; y++) {
            for (long x = 0; width > x; x++) {
                callback(x, y, imageData + pixelOffset);
                pixelOffset += 4;
            }
        }
    }

    /**
     * Returns the start pointer of the pixel data array. Be very careful when operating directly on image memory,
     * there's zero bounds checking. Use the [] operator on the image to stay safe unless you absolutely have to use
     * this method for performance reasons and it's 100% safe to do so (see class description for more on accessing
     * image data).
     **/
    uint8_t* getPixels() {
        return imageData;
    }

    /**
     * Lets you access imageData but does bounds checking for you. Throws if out of bounds.
     *
     * \param i
     *
     * \throws out_of_range
     **/
    uint8_t& operator [] (long i) {
        if (i >= 0 && i < rgbaArrayLength) {
            return imageData[i];
        }

        throw std::out_of_range("Received index outside of image range.");
    }

    ~Image() {
        // Clean up if we own this memory
        if (!memoryManagedExternally && !moved) {
            delete[] imageData;
        }
    }
};

