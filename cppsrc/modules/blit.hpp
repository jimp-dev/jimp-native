#pragma once
#include "../util/image.hpp"

extern "C"

/**
 * Blit a source image on to the target image. Edits target image in place.
 * 
 * \param source
 * \param target
 * \param xOffset
 * \param yOffset
 * \param sourceX
 * \param sourceY
 * \param sourceW
 * \param sourceH
 */
void blit(Image& source, Image& target, long xOffset, long yOffset, long sourceX, long sourceY, long sourceW, long sourceH);