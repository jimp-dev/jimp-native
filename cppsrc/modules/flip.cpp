#include "flip.hpp"

void flip (Image& image, bool horizontally, bool vertically) {
    if (!horizontally && !vertically) {
        return;
    }

    long xLimit;
    long yLimit;
    long stop;

    if (horizontally && !vertically) {
        xLimit = image.width / 2;
        yLimit = image.height;
        stop = image.pixelCount * 4;
    } else {
        xLimit = image.width;
        yLimit = image.height;
        stop = image.pixelCount / 2 * 4;
    }

    uint8_t* pixels = image.getPixels();

    for (long y = 0; yLimit > y; y++) {
        for (long x = 0; xLimit > x; x++) {
            long oppositeX = horizontally ? (image.width - x - 1) : x;
            long oppositeY = vertically ? (image.height - y - 1) : y;

            long currentIndex = image.getPixelIndex(x, y);

            if (currentIndex == stop) {
                return;
            }

            long oppositeIndex = image.getPixelIndex(oppositeX, oppositeY);

            uint8_t* pixelA = pixels + currentIndex;
            uint8_t* pixelB = pixels + oppositeIndex;

            std::swap_ranges(pixelA, pixelA + 4, pixelB);
        }
    }
}
