#pragma once
#include "../util/image.hpp"

enum ResizeMethod {
    NEAREST_NEIGHBOUR = 0,
    BILINEAR = 1,
    BICUBIC = 2,
    HERMITE = 3,
    BEZIER = 4
};

/**
 * Resizes the source image to the destination image using the provided resizing method.
 * 
 * \param src
 * \param dst Use an empty image with the desired size
 * \param method See the ResizeMethod enum for mapping
 */
void resize (Image& src, Image& dst, ResizeMethod method);
