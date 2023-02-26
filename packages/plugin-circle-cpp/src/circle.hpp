#pragma once
#include "image.hpp"

/**
 * Makes an image circular by making pixels outside the circle fully transparent.
 * 
 * \param image
 * \param radius
 * \param centreX
 * \param centreY
 */
void circle (Image& image, long radius, long centreX, long centreY) {
    radius = std::abs(radius);

    long aliasingRadiusSquared = std::pow(radius - 1, 2);
    long radiusSquared = std::pow(radius, 2);

    for (long y = 0; image.height > y; y++) {
        for (long x = 0; image.width > x; x++) {
            long current = std::pow(x - centreX, 2) + std::pow(y - centreY, 2);
            
            if (current > aliasingRadiusSquared && current <= radiusSquared) {
                // Use more expensive sqrt operation only when calculating anti aliasing.
                double aa = (double) radius - std::sqrt((double) current);

                uint8_t* pixel = image.getPixelAt(x, y);

                pixel[3] = aa * 255.0;
            } else if (current > radiusSquared) {
                uint8_t* pixel = image.getPixelAt(x, y);
                pixel[3] = 0;
            }
        }
    }
}