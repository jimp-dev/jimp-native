#include "colour.hpp"
#include "../util/colourUtil.hpp"
#include <cmath>

void brightness(uint8_t* pixelData, size_t rgbaArrayLength, double brightness) {
    for (size_t i = 0; rgbaArrayLength > i; i++) {
        if (i % 4 == 3) {
            continue; // Skip alpha channel.
        }

        double result;
        if (brightness < 0) {
            result = pixelData[i] * (1.0 + brightness);
        } else {
            result = pixelData[i] + (255.0 - pixelData[i]) * brightness;
        }

        if (result < 0.0) {
            result = 0.0;
        }

        if (result > 255.0) {
            result = 255.0;
        }

        pixelData[i] = (uint8_t) result;
    }
}

void opacity(uint8_t* pixelData, size_t rgbaArrayLength, double opacity) {
    for (size_t i = 3; rgbaArrayLength > i; i += 4) {
        pixelData[i] = pixelData[i] * opacity;
    }
}

void opaque(uint8_t* pixelData, size_t rgbaArrayLength) {
    for (size_t i = 3; rgbaArrayLength > i; i += 4) {
        pixelData[i] = 255;
    }
}

void contrast(uint8_t* pixelData, size_t rgbaArrayLength, double contrast) {
    double factor = (contrast + 1) / (1 - contrast);
    for (size_t i = 0; rgbaArrayLength > i; i++) {
        if (i % 4 == 3) {
            continue; // Skip alpha channel.
        }

        double result = std::floor(factor * (pixelData[i] - 127.0) + 127.0);

        if (result < 0.0) {
            result = 0.0;
        }

        if (result > 255.0) {
            result = 255.0;
        }

        pixelData[i] = (uint8_t) result;
    }
}

void posterize(uint8_t* pixelData, size_t rgbaArrayLength, double multiplier) {
    if (multiplier < 2.0) {
        multiplier = 2.0;
    }

    multiplier -= 1.0;

    for (size_t i = 0; rgbaArrayLength > i; i++) {
        if (i % 4 == 3) {
            continue; // Skip alpha channel.
        }

        double result = std::floor(pixelData[i] / 255.0 * multiplier) / multiplier * 255.0;

        if (result < 0.0) {
            result = 0.0;
        }

        if (result > 255.0) {
            result = 255.0;
        }

        pixelData[i] = (uint8_t) result;
    }
}

void sepia(uint8_t* pixelData, size_t rgbaArrayLength) {
    for (size_t offset = 0; rgbaArrayLength > offset; offset+= 4) {
        double red = pixelData[offset];
        double green = pixelData[offset + 1];
        double blue = pixelData[offset + 2];

        // Magic numbers taken directly from Jimp codebase.
        red = red * 0.393 + green * 0.769 + blue * 0.189;
        green = red * 0.349 + green * 0.686 + blue * 0.168;
        blue = red * 0.272 + green * 0.534 + blue * 0.131;

        pixelData[offset] = std::max(0.0, std::min(255.0, red));
        pixelData[offset + 1] = std::max(0.0, std::min(255.0, green));
        pixelData[offset + 2] = std::max(0.0, std::min(255.0, blue));
    }
}

void convolution(Image& source, Image& target, double** kernel, long kernelWidth, long kernelHeight, long xOffset, long yOffset, long width, long height, EdgeHandling edgeHandling, double size) {
    long kxOffset = -(kernelWidth / 2);
    long kyOffset = -(kernelWidth / 2);

    long xLimit = xOffset + width;
    long yLimit = yOffset + height;

    for (long y = 0; source.height > y; y++) {
        for (long x = 0; source.width > x; x++) {
            if (x >= xOffset && x < xLimit && y >= yOffset && y < yLimit) {
                double r = 0;
                double g = 0;
                double b = 0;

                for (long ky = 0; kernelHeight > ky; ky++) {
                    for (long kx = 0; kernelWidth > kx; kx++) {
                        double kval = kernel[ky][kx];

                        long sampleX = kxOffset + size * std::floor(x / size) + kx;
                        long sampleY = kyOffset + size * std::floor(y / size) + ky;
                        uint8_t* pixel = source.getPixelAt(sampleX, sampleY, edgeHandling);
                        if (pixel == nullptr) {
                            continue;
                        }

                        r += kval * pixel[0];
                        g += kval * pixel[1];
                        b += kval * pixel[2];
                    }
                }

                uint8_t* sourcePixel = source.getPixelAt(x, y);
                uint8_t* targetPixel = target.getPixelAt(x, y);

                targetPixel[0] = std::max(0.0, std::min(255.0, r));
                targetPixel[1] = std::max(0.0, std::min(255.0, g));
                targetPixel[2] = std::max(0.0, std::min(255.0, b));
                targetPixel[3] = sourcePixel[3];
            } else {
                uint8_t* sourcePixel = source.getPixelAt(x, y);
                uint8_t* targetPixel = target.getPixelAt(x, y);

                targetPixel[0] = sourcePixel[0];
                targetPixel[1] = sourcePixel[1];
                targetPixel[2] = sourcePixel[2];
                targetPixel[3] = sourcePixel[3];
            }
        }
    }
}

void greyscale(uint8_t* pixelData, size_t rgbaArrayLength) {
    size_t pixelCount = rgbaArrayLength / 4;

    for (size_t i = 0; pixelCount > i; i++) {
        size_t offset = i * 4;

        // Magic numbers taken directly from Jimp codebase.
        double grey =
            pixelData[offset] * 0.2126 +
            pixelData[offset + 1] * 0.7152 +
            pixelData[offset + 2] * 0.0722;

        pixelData[offset] = (uint8_t) grey;
        pixelData[offset + 1] = (uint8_t) grey;
        pixelData[offset + 2] = (uint8_t) grey;
    }
}
