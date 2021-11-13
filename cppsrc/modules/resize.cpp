#include "resize.hpp"
#include "../util/colourUtil.hpp"
#include "../util/imagejsPort.hpp"
#include "../util/jsImageResizerPort.hpp"
#include <cmath>

void nearestNeighbour(Image& src, Image& dst) {
    double xScaleFactor = (double) dst.width / (double) src.width;
    double yScaleFactor = (double) dst.height / (double) src.height;

    for (long y = 0; dst.height > y; y++) {
        long sampleY = std::floor(y / yScaleFactor);

        for (long x = 0; dst.width > x; x++) {
            uint8_t* samplePixel = src.getPixelAt(
                x / xScaleFactor,
                sampleY
            );

            uint8_t* targetPixel = dst.getPixelAt(x, y);
            targetPixel[0] = samplePixel[0];
            targetPixel[1] = samplePixel[1];
            targetPixel[2] = samplePixel[2];
            targetPixel[3] = samplePixel[3];
        }
    }
}

void bilinear(Image& src, Image& dst) {
    double xScaleFactor = (double) dst.width / (double) src.width;
    double yScaleFactor = (double) dst.height / (double) src.height;

    uint8_t* targetPixels = dst.getPixels();
    long offset = 0;

    for (long y = 0; dst.height > y; y++) {
        // Figure out the closest pixel in the source image our position maps to.
        long srcPosY = y / yScaleFactor;

        // Get the distance away from the closest pixel in the source image both in X and Y direction.
        double distanceY = (y - std::floor(srcPosY * yScaleFactor)) / yScaleFactor;

        for (long x = 0; dst.width > x; x++) {
            long srcPosX = x / xScaleFactor;
            double distanceX = (x - std::floor(srcPosX * xScaleFactor)) / xScaleFactor;

            // Sample the closest source pixel, the pixel to the east, the pixel to the south and the pixel south-east.
            uint8_t* sample00 = src.getPixelAt(srcPosX, srcPosY);
            uint8_t* sample10 = src.getPixelAt(srcPosX + 1, srcPosY, EDGE_CROP, sample00);
            uint8_t* sample01 = src.getPixelAt(srcPosX, srcPosY + 1, EDGE_CROP, sample00);
            uint8_t* sample11 = src.getPixelAt(srcPosX + 1, srcPosY + 1, EDGE_EXTEND);

            // Interpolate between source pixel and the pixel to the right.
            double rY0 = (sample10[0] - sample00[0]) * distanceX + sample00[0];
            double gY0 = (sample10[1] - sample00[1]) * distanceX + sample00[1];
            double bY0 = (sample10[2] - sample00[2]) * distanceX + sample00[2];
            double aY0 = (sample10[3] - sample00[3]) * distanceX + sample00[3];

            // Interpolate between the south pixel and the south-east pixel.
            double rY1 = (sample11[0] - sample01[0]) * distanceX + sample01[0];
            double gY1 = (sample11[1] - sample01[1]) * distanceX + sample01[1];
            double bY1 = (sample11[2] - sample01[2]) * distanceX + sample01[2];
            double aY1 = (sample11[3] - sample01[3]) * distanceX + sample01[3];

            // Interpolate between north and south interpolations based on Y distance.
            targetPixels[offset++] = (rY1 - rY0) * distanceY + rY0;
            targetPixels[offset++] = (gY1 - gY0) * distanceY + gY0;
            targetPixels[offset++] = (bY1 - bY0) * distanceY + bY0;
            targetPixels[offset++] = (aY1 - aY0) * distanceY + aY0;
        }
    }
}

void resize(Image& src, Image& dst, ResizeMethod method) {
    switch (method) {
        case ResizeMethod::NEAREST_NEIGHBOUR:
            nearestNeighbour(src, dst);
            break;
        case ResizeMethod::BILINEAR:
            bilinear(src, dst);
            break;
        case ResizeMethod::BICUBIC:
            complexInterpolation(src, dst, cubic);
            break;
        case ResizeMethod::HERMITE:
            complexInterpolation(src, dst, hermite);
            break;
        case ResizeMethod::BEZIER:
            complexInterpolation(src, dst, bezier);
            break;
        default:
            defaultResize(src, dst);
            break;
    }
}
