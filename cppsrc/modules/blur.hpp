#pragma once
#include "../util/image.hpp"

/**
 * Blurs the image with the specified blurring radius. Edits image in place.
 * 
 * \param image
 * \param radius
 **/
void blur (Image& image, int radius);