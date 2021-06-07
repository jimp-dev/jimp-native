#include "jsImageResizerPort.hpp"
#include <cmath>

 /**
  * If no resize algorithm is specified, JIMP uses this algorithm, which is slightly different from all the other
  * specifyable algorithms. It does two passes over the image, one horizontally and one vertically. It applies different
  * interpolation techniques in each direction depending on if the image is upscaled or downscaled in said direction.
  *
  * Original code in the JIMP codebase is based on JS-Image-Resizer. JS-Image-Resizer was released to public domain on
  * 29 July 2013. Original source code can be found here: https://github.com/taisel/JS-Image-Resizer.
  *
  * C++ port (c) 2021 Sjoerd Dal
  * JavaScript Image Resizer (c) 2012 - Grant Galitz
  */
void defaultResize(Image& src, Image& dst) {
    bool skipWidth = src.width == dst.width;
    bool skipHeight = src.height == dst.height;

    if (skipWidth && skipHeight) {
        std::copy(src.getPixels(), src.getPixels() + src.rgbaArrayLength, dst.getPixels());
        return;
    }

    /**
     * Because we're using floating point math to determine sample positions (like the original algorithm), there's a
     * chance we may end up with rounding errors on very big images. Instead of relying on null checks or EDGE_EXTEND,
     * which have an additional cost to them, we use the blankPixel and voidTarget as fallbacks.
     */
    uint8_t* blankPixel = new uint8_t[4];
    std::fill_n(blankPixel, 4, 0);
    uint8_t* voidTarget = new uint8_t[4];

    Image* intermediate = nullptr;
    if (!skipHeight && !skipWidth) {
        intermediate = new Image(dst.width, src.height);
    }

    // If we're skipping the height pass we can write directly to dst, no intermediate memory needed.
    Image* targetImage = skipHeight ? &dst : intermediate;
    Image* sourceImage = &src;

    // First pass - horizontal scaling
    if (!skipWidth) {
        double ratio = (double) sourceImage->width / (double) targetImage->width;
        double weight = 0.0;
        double firstWeight = 0.0;
        double secondWeight = 0.0;
        bool horizontalInterpolation = ratio < 1.0;

        if (horizontalInterpolation) {
            long x = 0;

            // We're dealing with upscaling along this axis, so use the interpolation algo.
            for (; weight < 1.0 / 3.0; x++, weight += ratio) {
                for (long y = 0; sourceImage->height > y; y++) {
                    uint8_t* sample = sourceImage->getPixelAt(0, y, EDGE_CROP, blankPixel);
                    uint8_t* target = targetImage->getPixelAt(x, y, EDGE_CROP, voidTarget);

                    target[0] = sample[0];
                    target[1] = sample[1];
                    target[2] = sample[2];
                    target[3] = sample[3];
                }
            }

            weight -= 1.0 / 3.0;
            for (; (sourceImage->width - 1) > weight; x++, weight += ratio) {
                secondWeight = std::fmod(weight, 1.0);
                firstWeight = 1.0 - secondWeight;

                long srcX = weight;

                for (long y = 0; sourceImage->height > y; y++) {
                    uint8_t* sampleA = sourceImage->getPixelAt(srcX, y, EDGE_CROP, blankPixel);
                    uint8_t* sampleB = sourceImage->getPixelAt(srcX + 1, y, EDGE_CROP, blankPixel);
                    uint8_t* target = targetImage->getPixelAt(x, y, EDGE_CROP, voidTarget);

                    target[0] = (double) sampleA[0] * firstWeight + (double) sampleB[0] * secondWeight;
                    target[1] = (double) sampleA[1] * firstWeight + (double) sampleB[1] * secondWeight;
                    target[2] = (double) sampleA[2] * firstWeight + (double) sampleB[2] * secondWeight;
                    target[3] = (double) sampleA[3] * firstWeight + (double) sampleB[3] * secondWeight;
                }
            }

            for (; targetImage->width > x; x++, weight += ratio) {
                for (long y = 0; sourceImage->height > y; y++) {
                    uint8_t* sample = sourceImage->getPixelAt(sourceImage->width - 1, y, EDGE_CROP, blankPixel);
                    uint8_t* target = targetImage->getPixelAt(x, y, EDGE_CROP, voidTarget);

                    target[0] = sample[0];
                    target[1] = sample[1];
                    target[2] = sample[2];
                    target[3] = sample[3];
                }
            }
        } else {
            double* rgbaScratchSpace = new double[sourceImage->height * 4];
            double* realColourCounts = new double[sourceImage->height];

            double ratioDivisor = 1.0 / ratio;
            double multiplier = 0;
            double currentPosition = 0;
            double actualPosition = 0;
            double amountToNext = 0;
            long x = 0;

            do {
                // Reset scratch space and colour counts.
                std::fill_n(rgbaScratchSpace, sourceImage->height * 4, 0.0);
                std::fill_n(realColourCounts, sourceImage->height, 0.0);

                weight = ratio;

                do {
                    amountToNext = 1.0 + actualPosition - currentPosition;
                    multiplier = std::min(weight, amountToNext);

                    for (long y = 0; sourceImage->height > y; y++) {
                        uint8_t* samplePixel = sourceImage->getPixelAt(actualPosition, y, EDGE_CROP, blankPixel);
                        bool alpha = samplePixel[3] > 0;

                        rgbaScratchSpace[y * 4] += (alpha ? samplePixel[0] : 0.0) * multiplier;
                        rgbaScratchSpace[y * 4 + 1] += (alpha ? samplePixel[1] : 0.0) * multiplier;
                        rgbaScratchSpace[y * 4 + 2] += (alpha ? samplePixel[2] : 0.0) * multiplier;
                        rgbaScratchSpace[y * 4 + 3] += samplePixel[3] * multiplier;

                        realColourCounts[y] += alpha ? multiplier : 0;
                    }

                    if (weight >= amountToNext) {
                        actualPosition++;
                        currentPosition = actualPosition;
                        weight -= amountToNext;
                    } else {
                        currentPosition += weight;
                        break;
                    }
                } while (weight > 0.0 && actualPosition < sourceImage->width);

                for (long y = 0; targetImage->height > y; y++) {
                    weight = realColourCounts[y];
                    multiplier = weight != 0.0 ? 1.0 / weight : 0;

                    uint8_t* targetPixel = targetImage->getPixelAt(x, y, EDGE_CROP, voidTarget);
                    targetPixel[0] = rgbaScratchSpace[y * 4] * multiplier;
                    targetPixel[1] = rgbaScratchSpace[y * 4 + 1] * multiplier;
                    targetPixel[2] = rgbaScratchSpace[y * 4 + 2] * multiplier;
                    targetPixel[3] = rgbaScratchSpace[y * 4 + 3] * ratioDivisor;
                }

                x++;
            } while (x < targetImage->width);

            delete[] rgbaScratchSpace;
            delete[] realColourCounts;
        }
    }

    // If we skipped the horizontal pass then we should read directly from src.
    sourceImage = skipWidth ? &src : intermediate;
    targetImage = &dst;

    // Second pass - vertical scaling
    if (!skipHeight) {
        double ratio = (double) sourceImage->height / (double) targetImage->height;
        double weight = 0.0;
        double firstWeight = 0.0;
        double secondWeight = 0.0;
        long y = 0;
        bool verticalInterpolation = ratio < 1.0;

        if (verticalInterpolation) {
            for (; weight < 1.0 / 3.0; y++, weight += ratio) {
                for (long x = 0; targetImage->width > x; x++) {
                    uint8_t* sample = sourceImage->getPixelAt(x, 0, EDGE_CROP, blankPixel);
                    uint8_t* target = targetImage->getPixelAt(x, y, EDGE_CROP, voidTarget);

                    target[0] = sample[0];
                    target[1] = sample[1];
                    target[2] = sample[2];
                    target[3] = sample[3];
                }
            }

            weight -= 1.0 / 3.0;
            for (; (sourceImage->height - 1) > weight; y++, weight += ratio) {
                secondWeight = std::fmod(weight, 1.0);
                firstWeight = 1.0 - secondWeight;

                long srcY = std::floor(weight);

                for (long x = 0; targetImage->width > x; x++) {
                    uint8_t* sampleA = sourceImage->getPixelAt(x, srcY, EDGE_CROP, blankPixel);
                    uint8_t* sampleB = sourceImage->getPixelAt(x, srcY + 1, EDGE_CROP, blankPixel);
                    uint8_t* target = targetImage->getPixelAt(x, y, EDGE_CROP, voidTarget);

                    target[0] = (double) sampleA[0] * firstWeight + (double) sampleB[0] * secondWeight;
                    target[1] = (double) sampleA[1] * firstWeight + (double) sampleB[1] * secondWeight;
                    target[2] = (double) sampleA[2] * firstWeight + (double) sampleB[2] * secondWeight;
                    target[3] = (double) sampleA[3] * firstWeight + (double) sampleB[3] * secondWeight;
                }
            }

            for (; targetImage->height > y; y++, weight += ratio) {
                for (long x = 0; sourceImage->width > x; x++) {
                    uint8_t* sample = sourceImage->getPixelAt(x, sourceImage->height - 1, EDGE_CROP, blankPixel);
                    uint8_t* target = targetImage->getPixelAt(x, y, EDGE_CROP, voidTarget);

                    target[0] = sample[0];
                    target[1] = sample[1];
                    target[2] = sample[2];
                    target[3] = sample[3];
                }
            }
        } else {
            double* rgbaScratchSpace = new double[sourceImage->width * 4];
            double* realColourCounts = new double[sourceImage->width];

            double ratioDivisor = 1.0 / ratio;
            double multiplier = 0;
            double currentPosition = 0;
            double actualPosition = 0;
            double amountToNext = 0;
            long y = 0;

            do {
                // Reset scratch space and colour counts.
                std::fill_n(rgbaScratchSpace, sourceImage->width * 4, 0.0);
                std::fill_n(realColourCounts, sourceImage->width, 0.0);

                weight = ratio;

                do {
                    amountToNext = 1.0 + actualPosition - currentPosition;
                    multiplier = std::min(weight, amountToNext);

                    for (long x = 0; sourceImage->width > x; x++) {
                        uint8_t* samplePixel = sourceImage->getPixelAt(x, actualPosition, EDGE_CROP, blankPixel);
                        bool alpha = samplePixel[3] > 0;

                        rgbaScratchSpace[x * 4] += (alpha ? samplePixel[0] : 0.0) * multiplier;
                        rgbaScratchSpace[x * 4 + 1] += (alpha ? samplePixel[1] : 0.0) * multiplier;
                        rgbaScratchSpace[x * 4 + 2] += (alpha ? samplePixel[2] : 0.0) * multiplier;
                        rgbaScratchSpace[x * 4 + 3] += samplePixel[3] * multiplier;

                        realColourCounts[x] += alpha ? multiplier : 0;
                    }

                    if (weight >= amountToNext) {
                        actualPosition++;
                        currentPosition = actualPosition;
                        weight -= amountToNext;
                    } else {
                        currentPosition += weight;
                        break;
                    }
                } while (weight > 0.0 && actualPosition < sourceImage->height);

                for (long x = 0; targetImage->width > x; x++) {
                    weight = 1.0 / realColourCounts[x];

                    uint8_t* targetPixel = targetImage->getPixelAt(x, y, EDGE_CROP, voidTarget);
                    targetPixel[0] = rgbaScratchSpace[x * 4] * weight;
                    targetPixel[1] = rgbaScratchSpace[x * 4 + 1] * weight;
                    targetPixel[2] = rgbaScratchSpace[x * 4 + 2] * weight;
                    targetPixel[3] = rgbaScratchSpace[x * 4 + 3] * ratioDivisor;
                }

                y++;
            } while (targetImage->height > y);

            delete[] rgbaScratchSpace;
            delete[] realColourCounts;
        }
    }

    if (intermediate != nullptr) {
        delete intermediate;
    }

    delete[] blankPixel;
    delete[] voidTarget;
}
