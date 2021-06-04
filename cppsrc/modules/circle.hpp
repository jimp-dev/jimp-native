#pragma once
#include "../util/image.hpp"

/**
 * Makes an image circular by making pixels outside the circle fully transparent.
 * 
 * \param image
 * \param radius
 * \param centreX
 * \param centreY
 */
void circle (Image& image, long radius, long centreX, long centreY);
