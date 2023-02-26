#pragma once
#include "image.hpp"

const double pi = 3.14159265358979323846;

/**
 * Rotate the image by the specified degrees.
 * 
 * \param image
 * \param degrees
 */
void rotate(Image& dst, double degrees) {
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