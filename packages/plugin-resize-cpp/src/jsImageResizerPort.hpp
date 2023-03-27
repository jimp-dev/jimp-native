#include <cmath>
#include "image.hpp"

enum Axis {
    X,
    Y
};

/**
 * Downscale algorithm that performs downscaling across a single axis at a time.
 */
void doDownscaleAlongAxis(Image& src, Image& dst, double ratio, Axis axis) {
    long srcAxisLimit = axis == Axis::X
        ? src.width
        : src.height;

    long srcAxisProgress = 0;
    double virtualSrcAxisProgress = 0;

    long srcBufferNextLineIncrement = axis == Axis::X
        ? src.width * 4
        : 4;

    long dstAxisLimit = axis == Axis::X
        ? dst.width
        : dst.height;

    long dstAxisProgress = 0;
    long dstBufferNextLineIncrement = axis == Axis::X
        ? dst.width * 4
        : 4;

    long oppositeAxisLimit = axis == Axis::X
        ? src.height
        : src.width;

    /**
     * These arrays hold the combined sample values for each position on the opposite axis, so if we're resizing across
     * X, this array will have a value for each Y position. This is so that we only have to calculate multipliers once
     * for each position on the axis we're resizing across.
     */
    double* rgbaAccumulators = new double[oppositeAxisLimit * 4];
    double* rgbaAccumulatorTotalWeights = new double[oppositeAxisLimit];

    double ratioDivisor = 1.0 / ratio;

    while (dstAxisLimit > dstAxisProgress) {
        // Reset accumulators and weights
        std::fill_n(rgbaAccumulators, oppositeAxisLimit * 4, 0.0);
        std::fill_n(rgbaAccumulatorTotalWeights, oppositeAxisLimit, 0.0);

        double weight = ratio;
        double distanceToNextSample = 0.0;
        long oppositeAxisProgress = 0;

        while (weight > 0.0 && srcAxisProgress < srcAxisLimit) {
            distanceToNextSample = 1.0 + srcAxisProgress - virtualSrcAxisProgress;

            long srcBufferOffset = axis == Axis::X
                ? srcAxisProgress * 4
                : srcAxisProgress * (src.width * 4);

            double multiplier = std::min(weight, distanceToNextSample);

            for (oppositeAxisProgress = 0; oppositeAxisLimit > oppositeAxisProgress; oppositeAxisProgress++) {
                bool alpha = src[srcBufferOffset + 3];

                // Don't count RGB values of samle if pixel is invisible.
                double sampleMultiplier = alpha
                    ? multiplier
                    : 0.0;

                long accumulatorOffset = oppositeAxisProgress * 4;
                rgbaAccumulators[accumulatorOffset] += src[srcBufferOffset] * sampleMultiplier;
                rgbaAccumulators[accumulatorOffset + 1] += src[srcBufferOffset + 1] * sampleMultiplier;
                rgbaAccumulators[accumulatorOffset + 2] += src[srcBufferOffset + 2] * sampleMultiplier;
                rgbaAccumulators[accumulatorOffset + 3] += src[srcBufferOffset + 3] * sampleMultiplier;

                rgbaAccumulatorTotalWeights[oppositeAxisProgress] += alpha ? sampleMultiplier : 0;

                srcBufferOffset += srcBufferNextLineIncrement;
            }

            if (weight >= distanceToNextSample) {
                srcAxisProgress++;
                virtualSrcAxisProgress = srcAxisProgress;
                weight -= distanceToNextSample;
            } else {
                /**
                 * When we reach this point it means we're on the border between two pixels in the target image, thus
                 * we add what's left of `weight` to influence the next iteration's `distanceToNextSample` value,
                 * causing the current sample pixel to be correctly counted towards the next destination pixel.
                */
                virtualSrcAxisProgress += weight;
                break;
            }
        };

        long dstOffset = axis == Axis::X
            ? dstAxisProgress * 4
            : dstAxisProgress * dst.width * 4;

        long accumulatorOffset = 0;
        for (oppositeAxisProgress = 0; oppositeAxisLimit > oppositeAxisProgress; oppositeAxisProgress++) {
            double multiplier = rgbaAccumulatorTotalWeights[oppositeAxisProgress] != 0.0
                ? 1.0 / rgbaAccumulatorTotalWeights[oppositeAxisProgress]
                : 0.0;

            dst[dstOffset] = std::round(rgbaAccumulators[accumulatorOffset++] * multiplier);
            dst[dstOffset + 1] = std::round(rgbaAccumulators[accumulatorOffset++] * multiplier);
            dst[dstOffset + 2] = std::round(rgbaAccumulators[accumulatorOffset++] * multiplier);
            dst[dstOffset + 3] = std::round(rgbaAccumulators[accumulatorOffset++] * ratioDivisor);

            dstOffset += dstBufferNextLineIncrement;
        }

        dstAxisProgress++;
    }

    delete[] rgbaAccumulators;
    delete[] rgbaAccumulatorTotalWeights;
}

/**
 * Upscales the given image across the given axis, using bilinear interpolation
 */
void doUpscaleAlongAxis(Image& src, Image& dst, double ratio, Axis axis) {
    long srcAxisLimit = axis == Axis::X
        ? src.width
        : src.height;

    long srcAxisProgress = 0;
    double virtualSrcAxisProgress = 0.0;

    long srcBufferLineIncrement = axis == Axis::X
        ? src.width * 4
        : 4;

    long srcBufferNextSampleOffset = axis == Axis::X
        ? 4
        : src.width * 4;

    long dstAxisProgress = 0;
    long dstAxisLimit = axis == Axis::X
        ? dst.width
        : dst.height;

    long dstBufferLineIncrement = axis == Axis::X
        ? dst.width * 4
        : 4;

    double initialPassVirtualLimit = 1.0 / 3.0;

    // Do a pass that accounts for initial edge pixels that don't have a second sample point
    for (;
        initialPassVirtualLimit > virtualSrcAxisProgress && dstAxisLimit > dstAxisProgress && srcAxisLimit > srcAxisProgress;
        dstAxisProgress++, virtualSrcAxisProgress += ratio, srcAxisProgress = virtualSrcAxisProgress
        ) {
        long srcBufferOffset = axis == Axis::X
            ? srcAxisProgress * 4
            : srcAxisProgress * src.width * 4;

        long dstBufferOffset = axis == Axis::X
            ? dstAxisProgress * 4
            : dstAxisProgress * dst.width * 4;

        long oppositeAxisProgress = 0;
        long oppositeAxisLimit = axis == Axis::X
            ? dst.height
            : dst.width;

        while (oppositeAxisLimit > oppositeAxisProgress) {
            dst[dstBufferOffset] = src[srcBufferOffset];
            dst[dstBufferOffset + 1] = src[srcBufferOffset + 1];
            dst[dstBufferOffset + 2] = src[srcBufferOffset + 2];
            dst[dstBufferOffset + 3] = src[srcBufferOffset + 3];

            srcBufferOffset += srcBufferLineIncrement;
            dstBufferOffset += dstBufferLineIncrement;

            oppositeAxisProgress++;
        }
    }

    // Remove overshoot from first pass and start from 0, this time interpolating between 2 neighbouring pixels
    virtualSrcAxisProgress -= initialPassVirtualLimit;
    srcAxisProgress = virtualSrcAxisProgress;

    // Limit - 1 because we want to do another pass like the first one but to deal with the other edge of the image
    long mainPassSrcAxisLimit = srcAxisLimit - 1;

    // Do a pass and interpolate with neighbouring pixels
    for (;
        mainPassSrcAxisLimit > srcAxisProgress && dstAxisLimit > dstAxisProgress;
        dstAxisProgress++, virtualSrcAxisProgress += ratio, srcAxisProgress = virtualSrcAxisProgress
        ) {
        double secondSampleWeight = virtualSrcAxisProgress - srcAxisProgress;
        double firstSampleWeight = 1.0 - secondSampleWeight;

        long srcBufferOffset = axis == Axis::X
            ? srcAxisProgress * 4
            : srcAxisProgress * src.width * 4;

        long dstBufferOffset = axis == Axis::X
            ? dstAxisProgress * 4
            : dstAxisProgress * dst.width * 4;

        long oppositeAxisProgress = 0;
        long oppositeAxisLimit = axis == Axis::X
            ? dst.height
            : dst.width;

        while (oppositeAxisLimit > oppositeAxisProgress) {
            dst[dstBufferOffset] =
                std::round(src[srcBufferOffset] * firstSampleWeight + src[srcBufferOffset + srcBufferNextSampleOffset] * secondSampleWeight);
            dst[dstBufferOffset + 1] =
                std::round(src[srcBufferOffset + 1] * firstSampleWeight + src[srcBufferOffset + srcBufferNextSampleOffset + 1] * secondSampleWeight);
            dst[dstBufferOffset + 2] =
                std::round(src[srcBufferOffset + 2] * firstSampleWeight + src[srcBufferOffset + srcBufferNextSampleOffset + 2] * secondSampleWeight);
            dst[dstBufferOffset + 3] =
                std::round(src[srcBufferOffset + 3] * firstSampleWeight + src[srcBufferOffset + srcBufferNextSampleOffset + 3] * secondSampleWeight);

            srcBufferOffset += srcBufferLineIncrement;
            dstBufferOffset += dstBufferLineIncrement;

            oppositeAxisProgress++;
        }
    }

    // Do a final pass without interpolation for the last row of source pixels
    for (; dstAxisLimit > dstAxisProgress; dstAxisProgress++) {
        long srcBufferOffset = axis == Axis::X 
            ? (srcAxisLimit - 1) * 4
            : (srcAxisLimit - 1) * src.width * 4;

        long dstBufferOffset = axis == Axis::X
            ? dstAxisProgress * 4
            : dstAxisProgress * dst.width * 4;

        long oppositeAxisProgress = 0;
        long oppositeAxisLimit = axis == Axis::X
            ? dst.height
            : dst.width;

        while (oppositeAxisLimit > oppositeAxisProgress) {
            dst[dstBufferOffset] = src[srcBufferOffset];
            dst[dstBufferOffset + 1] = src[srcBufferOffset + 1];
            dst[dstBufferOffset + 2] = src[srcBufferOffset + 2];
            dst[dstBufferOffset + 3] = src[srcBufferOffset + 3];

            srcBufferOffset += srcBufferLineIncrement;
            dstBufferOffset += dstBufferLineIncrement;

            oppositeAxisProgress++;
        }
    }
}

/**
 * Jimp uses this algorithm if no resize algorithm is specified. It's slightly different from all the other specifiable
 * algorithms. It does two passes over the image, one horizontally and one vertically. It applies different
 * interpolation techniques in each direction depending on if the image is upscaled or downscaled in said direction.
 *
 * Original code in the Jimp codebase is based on JS-Image-Resizer. JS-Image-Resizer was released to public domain on
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
        bool horizontalInterpolation = ratio < 1.0;

        if (horizontalInterpolation) {
            doUpscaleAlongAxis(*sourceImage, *targetImage, ratio, Axis::X);
        } else {
            doDownscaleAlongAxis(*sourceImage, *targetImage, ratio, Axis::X);
        }
    }

    // If we skipped the horizontal pass then we should read directly from src.
    sourceImage = skipWidth ? &src : intermediate;
    targetImage = &dst;

    // Second pass - vertical scaling
    if (!skipHeight) {
        double ratio = (double) sourceImage->height / (double) targetImage->height;
        bool verticalInterpolation = ratio < 1.0;

        if (verticalInterpolation) {
            doUpscaleAlongAxis(*sourceImage, *targetImage, ratio, Axis::Y);
        } else {
            doDownscaleAlongAxis(*sourceImage, *targetImage, ratio, Axis::Y);
        }
    }

    if (intermediate != nullptr) {
        delete intermediate;
    }
}
