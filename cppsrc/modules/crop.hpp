#pragma once
#include "../util/image.hpp"

/**
 * Crops the given image, but only inside its internal memory. Resulting C++ image instance will be bogus. It's up to
 * JavaScript to resize the buffer and change it's internal width and height values.
 * 
 * \param image
 * \param xOffset
 * \param yOffset
 * \param width
 * \param height
 */
void crop (Image& image, long xOffset, long yOffset, long width, long height);

/**
 * Automatically removes same-color borders from images. Resulting C++ image instance will be bogus. It's up to
 * JavaScript to resize the buffer.
 * 
 * \param image
 * \param leaveBorder amount of border pixels to leave in place
 * \param tolerance max border colour variation allowed
 * \param cropOnlyFrames only crop if border exists on all sides of the image
 * \param symmetric force cropping to be equal on opposite sides
 * \param north check north of image
 * \param east check east of image
 * \param south check south of image
 * \param west check west of image
 * \param newWidth new image width will be written to this
 * \param newHeight new image height will be written to this
 */
void autocrop (Image& image, long leaveBorder, double tolerance, bool cropOnlyFrames, bool symmetric, bool north, bool east, bool south, bool west, long& newWidth, long& newHeight);