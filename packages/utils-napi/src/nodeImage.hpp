#pragma once
#include "image.hpp"
#include <napi.h>
#include <optional>
#include <stdint.h>

/**
 * An extension of the generic image class that lets you create an image from a Node.js buffer. The buffer becomes
 * the backing memory of the image so not copying or moving takes place.
*/
class NodeImage: public Image {
protected:
    using Image::Image;

public:
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
    static NodeImage fromJSBuffer(Napi::Buffer<uint8_t>& buffer, Napi::Env& env, size_t width, size_t height) {
        Image::sizeSanityCheck(width, height);

        uint8_t* array = buffer.Data();
        size_t pixelCount = buffer.ElementLength() / 4;

        if (pixelCount != (width * height)) {
            throw Napi::Error::New(env, "Width and height do not match supplied buffer.");
        }

        return NodeImage(array, width, height, pixelCount, true);
    }
};

