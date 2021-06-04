#include "blit.hpp"

void blit(Image& source, Image& target, long xOffset, long yOffset, long sourceX, long sourceY, long sourceW, long sourceH) {
    for (long y = 0; sourceH > y; y++) {
        long sampleY = y + sourceY;

        if (sampleY < 0) {
            continue;
        }

        if (sampleY >= source.height) {
            break;
        }

        long targetY = y + yOffset;

        if (targetY < 0) {
            continue;
        }

        if (targetY >= target.height) {
            break;
        }

        for (long x = 0; sourceW > x; x++) {
            long sampleX = x + sourceX;

            if (sampleX < 0) {
                continue;
            }

            if (sampleX >= source.width) {
                break;
            }

            long targetX = x + xOffset;

            if (targetX >= target.width) {
                break;
            }

            if (targetX < 0) {
                continue;
            }

            uint8_t* src = source.getPixelAt(sampleX, sampleY);
            uint8_t* dst = target.getPixelAt(targetX, targetY);

            int sr = src[0];
            int sg = src[1];
            int sb = src[2];
            int sa = src[3];

            int dr = dst[0];
            int dg = dst[1];
            int db = dst[2];
            int da = dst[3];

            dr = ((sa * (sr - dr) - dr + 255) >> 8) + dr;
            dg = ((sa * (sg - dg) - dg + 255) >> 8) + dg;
            db = ((sa * (sb - db) - db + 255) >> 8) + db;

            da += sa;

            if (da > 255) {
                da = 255;
            }

            dst[0] = dr;
            dst[1] = dg;
            dst[2] = db;
            dst[3] = da;
        }
    }
}
