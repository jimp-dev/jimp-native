#include "mask.hpp"

void mask (Image& sourceImage, Image& targetImage, long xOffset, long yOffset) {
    for (long y = 0; sourceImage.height > y; y++) {
        for (long x = 0; sourceImage.width > x; x++) {
            long targetX = x + xOffset;
            long targetY = y + yOffset;

            uint8_t* targetPixel = targetImage.getPixelAt(targetX, targetY);

            if (targetPixel == nullptr) {
                continue;
            }

            uint8_t* sourcePixel = sourceImage.getPixelAt(x, y);

            unsigned int average = (sourcePixel[0] + sourcePixel[1] + sourcePixel[2]) / 3;

            targetPixel[3] = (targetPixel[3] * average / 255);
        }
    }
}
