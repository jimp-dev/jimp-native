#pragma once
#include <stdint.h>
#include <cstddef>

/**
 * Quickly iterates over an RGBA array inverting all the colours.
 * 
 * \param pixelData array of uint8s in the order of RGBA
 * \param pixelCount amount of pixels
 */
void invert (uint8_t* pixelData, size_t pixelCount);
