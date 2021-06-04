#pragma once
#include "../util/compositeModes.hpp"
#include "../util/image.hpp"

/**
 * Creates a composite of the two given images. Use xOffset and yOffset to change the position of the sourceImage over the destImage.
 * Alters destImage in place. Does not touch sourceImage.
 * 
 * \param sourceImage
 * \param destImage
 * \param xOffset
 * \param yOffset
 * \param mode Function to use to combine two given colours. Refer to util/compositeModes.hpp for available modes
 * \param opacitySource Opacity of the source image
 */
void composite (Image& sourceImage, Image& destImage, long xOffset, long yOffset, CompositeMode mode, double opacitySource);
