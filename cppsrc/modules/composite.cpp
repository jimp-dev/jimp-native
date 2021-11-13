#include "composite.hpp"
#include "../util/colourUtil.hpp"

void composite(Image& sourceImage, Image& destImage, long xOffset, long yOffset, CompositeMode mode, double opacitySource) {
    for(long y = 0; sourceImage.height > y; y++) {
        for(long x = 0; sourceImage.width > x; x++) {
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
