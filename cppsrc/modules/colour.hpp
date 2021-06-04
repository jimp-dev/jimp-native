#pragma once
#include <stdint.h>
#include "../util/image.hpp"

/**
 * Quickly iterates over an RGBA array changing the brightness of each pixel. Omits the Image type.
 * 
 * \param pixelData array of uint8s in the order of RGBA
 * \param rgbaArrayLength amount of pixels * 4
 * \param brightness Brightness multiplier (-1 to 1)
 */
void brightness(uint8_t* pixelData, size_t rgbaArrayLength, double brightness);

/**
 * Quickly iterates over an RGBA array changing the alpha value by the given multiplier. Omits the Image type entirely.
 * 
 * \param pixelData array of uint8s in the order of RGBA
 * \param rgbaArrayLength amount of pixels * 4
 * \param opacity Opacity multiplier
 */
void opacity (uint8_t* pixelData, size_t rgbaArrayLength, double opacity);

/**
 * Quickly iterates over an RGBA array changing the alpha value to 255.
 * 
 * \param pixelData array of uint8s in the order of RGBA
 * \param rgbaArrayLength amount of pixels * 4
 */
void opaque (uint8_t* pixelData, size_t rgbaArrayLength);


/**
 * Quickly iterates over an RGBA array changing the contrast of each pixel. Omits the Image type.
 * 
 * \param pixelData array of uint8s in the order of RGBA
 * \param rgbaArrayLength amount of pixels * 4
 * \param contrast Contrast multiplier (-1 to 1)
 */
void contrast(uint8_t* pixelData, size_t rgbaArrayLength, double contrast);

/**
 * Quickly iterates over an RGBA array applying a posterize effect. Omits the Image type.
 * 
 * \param pixelData array of uint8s in the order of RGBA
 * \param rgbaArrayLength amount of pixels * 4
 * \param multiplier Posterize multiplier, at least 2
 */
void posterize(uint8_t* pixelData, size_t rgbaArrayLength, double multiplier);

/**
 * Applies a sepia effect to the image by iterating over the RGBA array. Omits the Image type.
 * 
 * \param pixelData array of uint8s in the order of RGBA
 * \param rgbaArrayLength amount of pixels * 4
 */
void sepia(uint8_t* pixelData, size_t rgbaArrayLength);

/**
 * Applies a convolution matrix to the image.
 * 
 * \param source
 * \param target
 * \param kernel
 * \param kernelWidth
 * \param kernelHeight
 * \param xOffset
 * \param yOffset
 * \param width
 * \param height
 * \param edgeHandling
 * \param size Mainly used for the pixelate effect. Causes multiple samples from the source image to land on the same pixel, thus causing a pixelation effect.
 */
void convolution(Image& source, Image& target, double** kernel, long kernelWidth, long kernelHeight, long xOffset, long yOffset, long width, long height, EdgeHandling edgeHandling, double size);

/**
 * Applies a greyscale effect to the image.
 * 
 * \param pixelData array of uint8s in the order of RGBA
 * \param rgbaArrayLength amount of pixels * 4
 */
void greyscale(uint8_t* pixelData, size_t rgbaArrayLength);
