#include "colour.hpp"
#include <algorithm>
#include <cmath>

void clipColour(ColourFP& colour) {
    colour.r = std::min(1.0, std::max(0.0, colour.r));
    colour.g = std::min(1.0, std::max(0.0, colour.g));
    colour.b = std::min(1.0, std::max(0.0, colour.b));
    colour.a = std::min(1.0, std::max(0.0, colour.a));
}

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
