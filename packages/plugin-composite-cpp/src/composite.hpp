#pragma once
#include "image.hpp"
#include "compositeModes.hpp"

/**
 * Creates a composite of the two given images. Use xOffset and yOffset to change the position of the sourceImage over the destImage.
 * Alters destImage in place. Does not touch sourceImage.
 *
 * \param sourceImage
 * \param destImage
 * \param xOffset
 * \param yOffset
 * \param mode Function to use to combine two given colours. Refer to util/compositeModes.hpp for available modes
 * \param opacitySource Opacity of the source image
 */
void composite(Image& sourceImage, Image& destImage, long xOffset, long yOffset, CompositeMode mode, double opacitySource) {
    for (long y = 0; sourceImage.height > y; y++) {
        for (long x = 0; sourceImage.width > x; x++) {
            ColourFP sourceColour;
            sourceImage.getColourAt(x, y, sourceColour);

            ColourFP destColour;
            destImage.getColourAt(x + xOffset, y + yOffset, destColour);

            if (sourceColour.r == -1 || destColour.r == -1) {
                continue;
            }

            mode(sourceColour, destColour, opacitySource);

            destImage.setColourAt(x + xOffset, y + yOffset, destColour);
        }
    }
}
