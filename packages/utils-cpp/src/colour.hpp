#pragma once
#include <stdint.h>
#include <algorithm>
#include <cmath>

struct ColourFP {
    double r;
    double g;
    double b;
    double a;
};

/**
 * Takes a floating point colour and clips all the components back between the 0 - 1 range. Edits the colour in place.
 * 
 * \param colour
 */
void clipColour(ColourFP& colour) {
    colour.r = std::min(1.0, std::max(0.0, colour.r));
    colour.g = std::min(1.0, std::max(0.0, colour.g));
    colour.b = std::min(1.0, std::max(0.0, colour.b));
    colour.a = std::min(1.0, std::max(0.0, colour.a));
}

/**
 * Calculates the difference between two colours.
 * 
 * \param colourA
 * \param colourB
 * 
 * \returns 0 means no difference, 1 means maximum difference.
 */
double diff(uint8_t* colourA, uint8_t* colourB) {
    return (double) (
        std::max(
            std::pow(colourA[0] - colourB[0], 2), 
            std::pow(colourA[0] - colourB[0] - colourA[3] + colourB[3], 2)
        ) +
        std::max(
            std::pow(colourA[1] - colourB[1], 2),
            std::pow(colourA[1] - colourB[1] - colourA[3] + colourB[3], 2)
        ) +
        std::max(
            std::pow(colourA[2] - colourB[2], 2),
            std::pow(colourA[2] - colourB[2] - colourA[3] + colourB[3], 2)
        )
    ) / (255.0 * 255.0 * 3.0);
}
