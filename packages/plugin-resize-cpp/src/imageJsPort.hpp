#pragma once
#include "image.hpp"

typedef double (*InterpolationMethod) (double v0, double v1, double v2, double v3, double x);

/**
 * The following interpolation methods are ported over from the resize2.js file in the JIMP codebase:
 * https://raw.githubusercontent.com/oliver-moran/jimp/v0.16.1/packages/plugin-resize/src/modules/resize2.js
 *
 * C++ port (c) 2021 Sjoerd Dal (MIT)
 *
 * The original code is available here: https://raw.githubusercontent.com/guyonroche/imagejs/master/lib/resize.js under
 * the following license:
 *
 * Copyright (c) 2015 guyonroche
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
double cubic(double v0, double v1, double v2, double v3, double x) {
    double a0 = v3 - v2 - v0 + v1;
    double a1 = v0 - v1 - a0;
    double a2 = v2 - v0;

    double xMultiple = x * x;

    return std::max(
        0.0,
        std::min(255.0, a0 * (xMultiple * x) + a1 * xMultiple + a2 * x + v1)
    );
}

double hermite(double v0, double v1, double v2, double v3, double x) {
    double c1 = 0.5 * (v2 - v0);
    double c2 = v0 - 2.5 * v1 + 2.0 * v2 - 0.5 * v3;
    double c3 = 0.5 * (v3 - v0) + 1.5 * (v1 - v2);

    return std::max(
        0.0,
        std::min(255.0, ((c3 * x + c2) * x + c1) * x + v1 + 0.5)
    );
}

double bezier(double v0, double v1, double v2, double v3, double x) {
    double cp1 = v1 + (v2 - v0) / 4.0;
    double cp2 = v2 - (v3 - v1) / 4.0;
    double nt = 1.0 - x;
    double c0 = v1 * nt * nt * nt;
    double c1 = 3.0 * cp1 * nt * nt * x;
    double c2 = 3.0 * cp2 * nt * x * x;
    double c3 = v2 * x * x * x;

    return std::max(
        0.0,
        std::min(255.0, c0 + c1 + c2 + c3 + 0.5)
    );
}

void interpolatePixel(uint8_t* pixels[4], double x, Image& image, long offset, InterpolationMethod method) {
    double r0;
    double g0;
    double b0;
    double a0;

    if (pixels[0] != nullptr) {
        r0 = pixels[0][0];
        g0 = pixels[0][1];
        b0 = pixels[0][2];
        a0 = pixels[0][3];

    } else {
        r0 = 2.0 * pixels[1][0] - pixels[2][0];
        g0 = 2.0 * pixels[1][1] - pixels[2][1];
        b0 = 2.0 * pixels[1][2] - pixels[2][2];
        a0 = 2.0 * pixels[1][3] - pixels[2][3];
    }

    double r1 = pixels[1][0];
    double g1 = pixels[1][1];
    double b1 = pixels[1][2];
    double a1 = pixels[1][3];

    double r2 = pixels[2][0];
    double g2 = pixels[2][1];
    double b2 = pixels[2][2];
    double a2 = pixels[2][3];

    double r3;
    double g3;
    double b3;
    double a3;

    if (pixels[3] != nullptr) {
        r3 = pixels[3][0];
        g3 = pixels[3][1];
        b3 = pixels[3][2];
        a3 = pixels[3][3];
    } else {
        r3 = 2.0 * pixels[2][0] - pixels[1][0];
        g3 = 2.0 * pixels[2][1] - pixels[1][1];
        b3 = 2.0 * pixels[2][2] - pixels[1][2];
        a3 = 2.0 * pixels[2][3] - pixels[1][3];
    }

    image[offset++] = method(r0, r1, r2, r3, x);
    image[offset++] = method(g0, g1, g2, g3, x);
    image[offset++] = method(b0, b1, b2, b3, x);
    image[offset] = method(a0, a1, a2, a3, x);
}

void complexInterpolation(Image& src, Image& dst, InterpolationMethod method) {
    uint8_t* blankPixel = new uint8_t[4];
    std::fill_n(blankPixel, 4, 0);

    long widthMultiple = std::max(1.0, std::floor((double) src.width / dst.width));
    long intermediateWidth = dst.width * widthMultiple;

    long heightMultiple = std::max(1.0, std::floor((double) src.height / dst.height));
    long intermediateHeight = dst.height * heightMultiple;

    Image xInterpolated = Image::createEmpty(intermediateWidth, src.height);
    long targetOffset = 0;
    long rgbaRowOffset = xInterpolated.width * 4;

    // Interpolate image horizontally first.
    for (long x = 0; xInterpolated.width > x; x++) {
        double srcX = (double) x * (src.width - 1) / (double) intermediateWidth;
        long srcPosX = srcX;
        double distanceX = srcX - srcPosX;
        targetOffset = x * 4;

        for (long y = 0; xInterpolated.height > y; y++) {
            uint8_t* pixels[4] = {
                src.getPixelAt(srcPosX - 1, y),
                src.getPixelAt(srcPosX, y, EDGE_CROP, blankPixel),
                src.getPixelAt(srcPosX + 1, y, EDGE_CROP, blankPixel),
                src.getPixelAt(srcPosX + 2, y)
            };

            interpolatePixel(pixels, distanceX, xInterpolated, targetOffset, method);
            targetOffset += rgbaRowOffset;

            if (targetOffset > xInterpolated.rgbaArrayLength) {
                break;
            }
        }
    }

    // If the final image is smaller than half the source image, interpolate to a multiple of the result image size 
    // first, then scale down to desired size. This produces better looking results.
    Image* intermediate = nullptr;
    long multiplier = widthMultiple * heightMultiple;
    if (multiplier > 1) {
        intermediate = new Image(intermediateWidth, intermediateHeight);
    }

    targetOffset = 0;

    // Interpolate image vertically.
    for (long y = 0; intermediateHeight > y; y++) {
        double srcY = (double) y * (src.height - 1) / (double) intermediateHeight;
        long srcPosY = srcY;
        double distanceY = srcY - srcPosY;

        for (long x = 0; intermediateWidth > x; x++) {
            uint8_t* pixels[4] = {
                xInterpolated.getPixelAt(x, srcPosY - 1),
                xInterpolated.getPixelAt(x, srcPosY, EDGE_CROP, blankPixel),
                xInterpolated.getPixelAt(x, srcPosY + 1, EDGE_CROP, blankPixel),
                xInterpolated.getPixelAt(x, srcPosY + 2)
            };

            interpolatePixel(
                pixels,
                distanceY,
                intermediate == nullptr ? dst : *intermediate,
                targetOffset,
                method
            );

            targetOffset += 4;
        }
    }

    // Scale down to destination image if we took the multiple interpolation route.
    if (multiplier > 1) {
        targetOffset = 0;

        for (long y = 0; dst.height > y; y++) {
            for (long x = 0; dst.width > x; x++) {
                int r = 0;
                int g = 0;
                int b = 0;
                int a = 0;
                int realColours = 0;

                for (long mY = 0; heightMultiple > mY; mY++) {
                    long ySamplePos = y * heightMultiple + mY;

                    for (long mX = 0; widthMultiple > mX; mX++) {
                        long xSamplePos = x * widthMultiple + mX;

                        uint8_t* samplePixel = intermediate->getPixelAt(xSamplePos, ySamplePos, EDGE_CROP, blankPixel);

                        if (samplePixel[3] > 0) {
                            r += samplePixel[0];
                            g += samplePixel[1];
                            b += samplePixel[2];
                            a += samplePixel[3];
                            realColours++;
                        }
                    }
                }

                dst[targetOffset++] = realColours > 0 ? r / realColours : 0;
                dst[targetOffset++] = realColours > 0 ? g / realColours : 0;
                dst[targetOffset++] = realColours > 0 ? b / realColours : 0;
                dst[targetOffset++] = a / multiplier;
            }
        }

        delete intermediate;
    }

    delete[] blankPixel;
}