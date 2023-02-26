#pragma once
#include "image.hpp"

const int iterations = 2;

/**
 * Blurs the image with the specified blurring radius. Edits image in place. Approximates a gaussian blur by adding
 * horizontal / vertical motion blur twice.
 * 
 * \param image
 * \param radius
 **/
void blur (Image& image, int radius) {
    int diameter = radius + radius + 1;

    for (int iteration = 0; iterations > iteration; iteration++) {
        Image original = image.clone();
        Image intermediate = image.clone();

        //Add horizontal motion blur
        for (int y = 0; image.height > y; y++) {
            int r = 0;
            int g = 0;
            int b = 0;
            int a = 0;

            for (int x = 0; image.width > x; x++) {
                uint8_t* targetPixel = intermediate.getPixelAt(x, y);

                /* 
                Only compute the whole kernel once, then slide the blur window along by subtracting the first kernel 
                value from the previous iteration and adding the last kernel value of this iteration.
                */
                if (x == 0) {
                    for (int i = -radius; radius >= i; i++) {
                        uint8_t* pixel = original.getPixelAt(std::min(std::max(x - i, 0), (int) image.width - 1), y);
                        r += pixel[0];
                        g += pixel[1];
                        b += pixel[2];
                        a += pixel[3];
                    }
                } else {
                    uint8_t* dropPixel = original.getPixelAt(std::min(std::max(x - (radius + 1), 0), (int) image.width - 1), y);
                    r -= dropPixel[0];
                    g -= dropPixel[1];
                    b -= dropPixel[2];
                    a -= dropPixel[3];
                        
                    uint8_t* pixel = original.getPixelAt(std::min(x + radius, (int) image.width - 1), y);
                    r += pixel[0];
                    g += pixel[1];
                    b += pixel[2];
                    a += pixel[3];                
                }

                targetPixel[0] = r / diameter;
                targetPixel[1] = g / diameter;
                targetPixel[2] = b / diameter;
                targetPixel[3] = a / diameter;
            }
        }

        //Add vertical motion blur
        for (int x = 0; image.width > x; x++) {
            int r = 0;
            int g = 0;
            int b = 0;
            int a = 0;

            for (int y = 0; image.height > y; y++) {
                uint8_t* targetPixel = image.getPixelAt(x, y);

                if (y == 0) {
                    for (int i = -radius; radius >= i; i++) {
                        uint8_t* pixel = intermediate.getPixelAt(x, std::min(std::max(y - i, 0), (int) image.height - 1));
                        r += pixel[0];
                        g += pixel[1];
                        b += pixel[2];
                        a += pixel[3];
                    }
                } else {
                    uint8_t* dropPixel = intermediate.getPixelAt(x, std::min(std::max(y - (radius + 1), 0), (int) image.height - 1));
                    r -= dropPixel[0];
                    g -= dropPixel[1];
                    b -= dropPixel[2];
                    a -= dropPixel[3];

                    uint8_t* pixel = intermediate.getPixelAt(x, std::min(y + radius, (int) image.height - 1));
                    r += pixel[0];
                    g += pixel[1];
                    b += pixel[2];
                    a += pixel[3];
                }

                targetPixel[0] = r / diameter;
                targetPixel[1] = g / diameter;
                targetPixel[2] = b / diameter;
                targetPixel[3] = a / diameter;
            }
        }
    }
}
