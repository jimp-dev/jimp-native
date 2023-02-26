#pragma once
#include <stdint.h>
#include <cstddef>

/**
 * Quickly iterates over an RGBA array inverting all the colours.
 * 
 * \param pixelData array of uint8s in the order of RGBA
 * \param pixelCount amount of pixels
 */
void invert (uint8_t* pixelData, size_t pixelCount) {
    for (size_t i = 0; pixelCount > i; i++) {
        size_t offset = i * 4;
        pixelData[offset] = 255 - pixelData[offset];
        pixelData[offset + 1] = 255 - pixelData[offset + 1];
        pixelData[offset + 2] = 255 - pixelData[offset + 2];
    }
}
