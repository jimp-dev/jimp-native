#pragma once
#include "image.hpp"

const double pi = 3.14159265358979323846;

/**
 * Rotate the image by a multiple of 90 degrees.
 */
void matrixRotate(Image& src, Image& dst, int degrees) {
    // Do some final assertions to prevent UB
    if (degrees < 0 || degrees > 360 || degrees % 90 != 0) {
        throw std::invalid_argument("'degrees' must be a positive number and a multiple of 90");
    }

    long expectedWidth = degrees % 180 == 90
        ? src.height
        : src.width;

    long expectedHeight = degrees % 180 == 90
        ? src.width
        : src.height;

    if (dst.width != expectedWidth) {
        throw std::invalid_argument("target image has invalid width!");
    }

    if (dst.height != expectedHeight) {
        throw std::invalid_argument("target image has invalid height!");
    }

    if (degrees == 0) {
        std::copy(src.getPixels(), src.getPixels() + src.rgbaArrayLength, dst.getPixels());
        return;
    }

    for (long y = 0; src.height > y; y++) {
        for (long x = 0; src.width > x; x++) {
            uint8_t* srcPixel = src.getPixelAt(x, y);
            uint8_t* dstPixel;

            switch (degrees) {
                case 90:
                    dstPixel = dst.getPixelAt(
                        y,
                        src.width - x - 1
                    );
                    break;
                case 180:
                    dstPixel = dst.getPixelAt(
                        src.width - x - 1,
                        src.height - y - 1
                    );
                    break;
                default:
                    dstPixel = dst.getPixelAt(
                        src.height - y - 1,
                        x
                    );
                    break;
            }

            dstPixel[0] = srcPixel[0];
            dstPixel[1] = srcPixel[1];
            dstPixel[2] = srcPixel[2];
            dstPixel[3] = srcPixel[3];
        }
    }
}

/**
 * Rotate the image by the specified degrees, can work with any number.
 *
 * \param image
 * \param degrees
 */
void advancedRotate(Image& dst, double degrees) {
    Image src = dst.clone();

    degrees = std::fmod(degrees, 360.0);

    double radians = (degrees * pi) / 180.0;
    double cosine = std::cos(radians);
    double sine = std::sin(radians);

    double centreX = dst.width / 2.0;
    double centreY = dst.height / 2.0;

    for (long y = 1; src.height >= y; y++) {
        double cartesianY = y - centreY;

        for (long x = 1; src.width >= x; x++) {
            double cartesianX = x - centreX;

            long sampleX = std::round(cosine * cartesianX - sine * cartesianY + centreX);
            long sampleY = std::round(cosine * cartesianY + sine * cartesianX + centreY);

            uint8_t* samplePixel = src.getPixelAt(sampleX, sampleY);
            uint8_t* targetPixel = dst.getPixelAt(x - 1, y - 1);

            if (samplePixel == nullptr) {
                targetPixel[0] = 0;
                targetPixel[1] = 0;
                targetPixel[2] = 0;
                targetPixel[3] = 0;
                continue;
            }

            targetPixel[0] = samplePixel[0];
            targetPixel[1] = samplePixel[1];
            targetPixel[2] = samplePixel[2];
            targetPixel[3] = samplePixel[3];
        }
    }
}