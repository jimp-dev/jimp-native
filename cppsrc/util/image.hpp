#pragma once
#include "colour.hpp"
#include <napi.h>
#include <optional>

enum EdgeHandling {
    EDGE_EXTEND = 1,
    EDGE_WRAP = 2,
    EDGE_CROP = 3,
};

/**
 * The image class provides a thin wrapper for images that reside in a node Buffer. The image class will use the buffer
 * data as its backing memory directly if created with ::fromJSBuffer, avoiding any data copying. Clones and instances
 * made with ::createEmpty have their own memory on the heap (this memory is automatically freed on object destruction).
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
 * getColourFP and setColourAt are useful if you are implementing an algorithm that heavily relies on floating point
 * arithmetic. These functions handle the conversions to and from 8 bit colour components to 0 - 1 doubles.
 */
class Image {
private:
    Image(uint8_t* imageData, long width, long height, size_t pixelCount, bool memoryManagedExternally);
    uint8_t* imageData;

public:
    Image() = delete;
    Image(long width, long height);
    Image(const Image& image);
    Image(Image&& image);

    const long width;
    const long height;
    const size_t pixelCount;
    const long rgbaArrayLength;
    const bool memoryManagedExternally;
    bool moved = false;

    /**
    * Takes a Node.js buffer and wraps it with an Image class. Image operations are reflected in the buffer.
    *
    * \param buffer
    * \param env
    * \param width
    * \param height
    *
    * \throws Napi::Error if arguments passed are not sane.
    **/
    static Image fromJSBuffer(Napi::Buffer<uint8_t>& buffer, Napi::Env& env, size_t width, size_t height);

    /**
     * Returns a clone of the image that doesn't affect JavaScript memory.
     *
     **/
    Image clone();

    /**
     * Creates an empty image outside of JavaScript memory.
     *
     * \param width
     * \param height
     **/
    static Image createEmpty(size_t width, size_t height);

    /**
     * Returns the index of the pixel in the backing RGBA image data, starting at the red component. Returns -1 if
     * out of bounds with EDGE_CROP on.
     *
     * \param x
     * \param y
     * \param edgeHandling
     **/
    long getPixelIndex(long x, long y, EdgeHandling edgeHandling = EDGE_CROP);

    /**
     * Returns a pointer to the RGBA components in memory. Returns none parameter if out of bounds (nullptr by default).
     *
     * \param x
     * \param y
     * \param edgeHandling
     * \param none
     *
     **/
    uint8_t* getPixelAt(long x, long y, EdgeHandling edgeHandling = EDGE_CROP, uint8_t* none = nullptr);

    /**
     * Sets a ColourFP to the value of the pixel at the specified location. Sets with all components to -1 if no pixel
     * was found at the given coordinates.
     *
     * \param x
     * \param y
     * \param colour
     * \param edgeHandling
     **/
    void getColourAt(long x, long y, ColourFP& colour, EdgeHandling edgeHandling = EDGE_CROP);

    /**
     * Sets the pixel at the given location to the given colour. Handles clipping the colour components as well.
     *
     * \param x
     * \param y
     * \param edgeHandling
     **/
    void setColourAt(long x, long y, ColourFP colour, EdgeHandling edgeHandling = EDGE_CROP);

    /**
     * Clears the image, setting the bitmap to all zeroes.
     **/
    void clear();

    /**
     * Iterates over every pixel in the image, calling the provided function with x, y and pixel data.
     **/
    void iterate (const std::function <void (long x, long y, uint8_t* pixel)>& callback);

    /**
     * Returns the start pointer of the pixel data array. Be very careful when operating directly on image memory,
     * there's zero bounds checking. Use the [] operator on the image to stay safe unless you absolutely have to use
     * this method for performance reasons and it's 100% safe to do so (see class description for more on accessing
     * image data).
     **/
    uint8_t* getPixels();

    /**
     * Lets you access imageData but does bounds checking for you. Throws if out of bounds.
     * 
     * \param i
     * 
     * \throws out_of_range
     **/
    uint8_t& operator [] (long i);

    ~Image();
};

