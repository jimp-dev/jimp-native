#pragma once
#include <stdint.h>

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
void clipColour(ColourFP& colour);

/**
 * Calculates the difference between two colours.
 * 
 * \param colourA
 * \param colourB
 * 
 * \returns 0 means no difference, 1 means maximum difference.
 */
double diff(uint8_t* colourA, uint8_t* colourB);