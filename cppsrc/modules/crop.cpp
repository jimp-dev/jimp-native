#include "crop.hpp"
#include "cmath"
#include "../util/colour.hpp"

void crop (Image& image, long xOffset, long yOffset, long width, long height) {
    width = std::max(std::min(width, image.width), (long) 0);
    height = std::max(std::min(height, image.height), (long) 0);

    xOffset = std::max(xOffset, (long) 0);
    yOffset = std::max(yOffset, (long) 0);

    if (xOffset + width > image.width) {
        width = image.width - (image.width - width);
    }
    
    if (yOffset + height > image.height) {
        height = image.height - (image.height - height);
    }

    if (width == 0 || height == 0) {
        return;
    }

    uint8_t* imageData = image.getPixels();
    long offset = 0;

    for (long y = 0; height > y; y++) {
        for (long x = 0; width > x; x++) {
            uint8_t* samplePixel = image.getPixelAt(x + xOffset, y + yOffset);

            if (samplePixel == nullptr) {
                continue;
            }

            imageData[offset++] = samplePixel[0];
            imageData[offset++] = samplePixel[1];
            imageData[offset++] = samplePixel[2];
            imageData[offset++] = samplePixel[3];
        }
    }
}

void autocrop (Image& image, long leaveBorder, double tolerance, bool cropOnlyFrames, bool symmetric, bool north, bool east, bool south, bool west, long& newWidth, long& newHeight) {
    long northPixels = 0;
    long eastPixels = 0;
    long southPixels = 0;
    long westPixels = 0;

    if (cropOnlyFrames && (!north || !east || !south || !west)) {
        return;
    }

    scanLoop:
    if (north) {
        uint8_t* targetColour = image.getPixelAt(0, 0);

        for (long y = 0; image.height > y; y++) {
            for (long x = 0; image.width > x; x++) {
                uint8_t* sampleColour = image.getPixelAt(x, y);

                if (diff(sampleColour, targetColour) > tolerance) {
                    north = false;
                    goto scanLoop;
                }
            }

            northPixels++;
        }
    }

    if (east) {
        uint8_t* targetColour = image.getPixelAt(image.width - 1, 0);

        for (long x = image.width - 1; x >= 0; x--) {
            for (long y = 0; image.height > y; y++) {
                uint8_t* sampleColour = image.getPixelAt(x, y);

                if (diff(sampleColour, targetColour) > tolerance) {
                    east = false;
                    goto scanLoop;
                }
            }

            eastPixels++;
        }
    }

    if (south) {
        uint8_t* targetColour = image.getPixelAt(image.width - 1, image.height - 1);

        for (long y = image.height - 1; y >= 0; y--) {
            for (long x = 0; image.width > x; x++) {
                uint8_t* sampleColour = image.getPixelAt(x, y);

                if (diff(sampleColour, targetColour) > tolerance) {
                    south = false;
                    goto scanLoop;
                }
            }

            southPixels++;
        }
    }

    if (west) {
        uint8_t* targetColour = image.getPixelAt(0, image.height - 1);

        for (long x = 0; image.width > x; x++) {
            for (long y = 0; image.height > y; y++) {
                uint8_t* sampleColour = image.getPixelAt(x, y);

                if (diff(sampleColour, targetColour) > tolerance) {
                    west = false;
                    goto scanLoop;
                }
            }
            
            westPixels++;
        }
    }

    northPixels -= leaveBorder;
    eastPixels -= leaveBorder;
    southPixels -= leaveBorder;
    westPixels -= leaveBorder;

    if (cropOnlyFrames && (northPixels < 1 || eastPixels < 1 || southPixels < 1 || westPixels < 1)) {
        return;
    }

    if (symmetric) {
        northPixels = std::min(northPixels, southPixels);
        southPixels = northPixels;
        westPixels = std::min(westPixels, eastPixels);
        eastPixels = westPixels;
    }

    long xOffset = std::max(westPixels, 0l);
    long yOffset = std::max(northPixels, 0l);
    long width = std::max(image.width - eastPixels - xOffset, 1l);
    long height = std::max(image.height - southPixels - yOffset, 1l);

    crop(image, xOffset, yOffset, width, height);

    newWidth = width;
    newHeight = height;
}
