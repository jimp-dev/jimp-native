#pragma once
#include "image.hpp"

/**
 * Applies a dithering effect to the given image.
 * 
 * \param image
 */
void dither (Image& image) {
    for (long y = 0; image.height > y; y++) {
        for (long x = 0; image.width > x; x++) {
            uint8_t* pixel = image.getPixelAt(x, y);
            int threshold = ((y & 3) << 2) + (x % 4);
            int dither = rgb565Matrix[threshold];

            pixel[0] = std::min(pixel[0] + dither, 0xFF);
            pixel[1] = std::min(pixel[1] + dither, 0xFF);
            pixel[2] = std::min(pixel[2] + dither, 0xFF);
        }
    }
}