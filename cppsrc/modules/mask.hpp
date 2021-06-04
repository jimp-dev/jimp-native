#pragma once
#include "../util/image.hpp"

/**
 * Applies a mask (the source image) to the target image. A black pixel in the mask is a transperant pixel on the
 * target image.
 * 
 * \param sourceImage
 * \param targetImage
 * \param x
 * \param y
 */
void mask (Image& sourceImage, Image& targetImage, long x, long y);
