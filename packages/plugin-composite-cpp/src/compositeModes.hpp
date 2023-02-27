#pragma once
#include "colour.hpp"

enum CompositeModes {
    BLEND_SOURCE_OVER = 0,
    BLEND_DESTINATION_OVER = 1,
    BLEND_MULTIPLY = 2,
    BLEND_ADD = 3,
    BLEND_SCREEN = 4,
    BLEND_OVERLAY = 5,
    BLEND_DARKEN = 6,
    BLEND_LIGHTEN = 7,
    BLEND_HARDLIGHT = 8,
    BLEND_DIFFERENCE = 9,
    BLEND_EXCLUSION = 10
};

typedef void (*CompositeMode) (ColourFP& src, ColourFP& dst, double opacity);

/**
 * Implementations of the following methods are basically straight ports of the JIMP equivalents in composite-modes.js
 *
 * The only difference is that they alter memory of the dst parameter in place.
 **/
void srcOver(ColourFP& src, ColourFP& dst, double opacity) {
    double srcA = src.a * opacity;
    double orgA = dst.a;

    dst.a = orgA + srcA - orgA * srcA;
    dst.r = (src.r * srcA + dst.r * orgA * (1 - srcA)) / dst.a;
    dst.g = (src.g * srcA + dst.g * orgA * (1 - srcA)) / dst.a;
    dst.b = (src.b * srcA + dst.b * orgA * (1 - srcA)) / dst.a;
}

void dstOver(ColourFP& src, ColourFP& dst, double opacity) {
    double srcA = src.a * opacity;
    double orgA = dst.a;

    dst.a = dst.a + srcA - dst.a * srcA;
    dst.r = (dst.r * orgA + src.r * srcA * (1 - orgA)) / dst.a;
    dst.g = (dst.g * orgA + src.g * srcA * (1 - orgA)) / dst.a;
    dst.b = (dst.b * orgA + src.b * srcA * (1 - orgA)) / dst.a;
}

void multiply(ColourFP& src, ColourFP& dst, double opacity) {
    double srcA = src.a * opacity;
    double orgA = dst.a;

    dst.a = dst.a + srcA - dst.a * srcA;

    double sra = src.r * srcA;
    double sga = src.g * srcA;
    double sba = src.b * srcA;

    double dra = dst.r * orgA;
    double dga = dst.g * orgA;
    double dba = dst.b * orgA;

    dst.r = (sra * dra + sra * (1 - orgA) + dra * (1 - srcA)) / dst.a;
    dst.g = (sga * dga + sga * (1 - orgA) + dga * (1 - srcA)) / dst.a;
    dst.b = (sba * dba + sba * (1 - orgA) + dba * (1 - srcA)) / dst.a;
}

void add(ColourFP& src, ColourFP& dst, double opacity) {
    double srcA = src.a * opacity;
    double orgA = dst.a;

    dst.a = dst.a + srcA - dst.a * srcA;

    double sra = src.r * srcA;
    double sga = src.g * srcA;
    double sba = src.b * srcA;

    double dra = dst.r * orgA;
    double dga = dst.g * orgA;
    double dba = dst.b * orgA;

    dst.r = (sra + dra) / dst.a;
    dst.g = (sga + dga) / dst.a;
    dst.b = (sba + dba) / dst.a;
}

void screen(ColourFP& src, ColourFP& dst, double opacity) {
    double srcA = src.a * opacity;
    double orgA = dst.a;

    dst.a = dst.a + srcA - dst.a * srcA;

    double sra = src.r * srcA;
    double sga = src.g * srcA;
    double sba = src.b * srcA;

    double dra = dst.r * orgA;
    double dga = dst.g * orgA;
    double dba = dst.b * orgA;

    dst.r =
        (sra * orgA +
         dra * srcA -
         sra * dra +
         sra * (1 - orgA) +
         dra * (1 - srcA)
        ) / dst.a;

    dst.g =
        (sga * orgA +
         dga * srcA -
         sga * dga +
         sga * (1 - orgA) +
         dga * (1 - srcA)
        ) / dst.a;

    dst.b =
        (sba * orgA +
         dba * srcA -
         sba * dba +
         sba * (1 - orgA) +
         dba * (1 - srcA)
        ) / dst.a;
}

void overlay(ColourFP& src, ColourFP& dst, double opacity) {
    double srcA = src.a * opacity;
    double orgA = dst.a;

    dst.a = dst.a + srcA - dst.a * srcA;

    double sra = src.r * srcA;
    double sga = src.g * srcA;
    double sba = src.b * srcA;

    double dra = dst.r * orgA;
    double dga = dst.g * orgA;
    double dba = dst.b * orgA;

    dst.r =
        (2 * dra <= orgA
         ? 2 * sra * dra + sra * (1 - orgA) + dra * (1 - srcA)
         : sra * (1 + orgA) + dra * (1 + srcA) - 2 * dra * sra - orgA * srcA) / dst.a;

    dst.g =
        (2 * dga <= orgA
         ? 2 * sga * dga + sga * (1 - orgA) + dga * (1 - srcA)
         : sga * (1 + orgA) + dga * (1 + srcA) - 2 * dga * sga - orgA * srcA) / dst.a;

    dst.b =
        (2 * dba <= orgA
         ? 2 * sba * dba + sba * (1 - orgA) + dba * (1 - srcA)
         : sba * (1 + orgA) + dba * (1 + srcA) - 2 * dba * sba - orgA * srcA) / dst.a;
}

void darken(ColourFP& src, ColourFP& dst, double opacity) {
    double srcA = src.a * opacity;
    double orgA = dst.a;

    dst.a = dst.a + srcA - dst.a * srcA;

    double sra = src.r * srcA;
    double sga = src.g * srcA;
    double sba = src.b * srcA;

    double dra = dst.r * orgA;
    double dga = dst.g * orgA;
    double dba = dst.b * orgA;

    dst.r = (
                 std::min(sra * orgA, dra * srcA) +
                 sra * (1 - orgA) +
                 dra * (1 - srcA)
             ) / dst.a;

    dst.g = (
                 std::min(sga * orgA, dga * srcA) +
                 sga * (1 - orgA) +
                 dga * (1 - srcA)
             ) / dst.a;

    dst.b = (
                 std::min(sba * orgA, dba * srcA) +
                 sba * (1 - orgA) +
                 dba * (1 - srcA)
             ) / dst.a;
}

void lighten(ColourFP& src, ColourFP& dst, double opacity) {
    double srcA = src.a * opacity;
    double orgA = dst.a;

    dst.a = dst.a + srcA - dst.a * srcA;

    double sra = src.r * srcA;
    double sga = src.g * srcA;
    double sba = src.b * srcA;

    double dra = dst.r * orgA;
    double dga = dst.g * orgA;
    double dba = dst.b * orgA;

    dst.r = (
                 std::max(sra * orgA, dra * srcA) +
                 sra * (1 - orgA) +
                 dra * (1 - srcA)
             ) / dst.a;

    dst.g = (
                 std::max(sga * orgA, dga * srcA) +
                 sga * (1 - orgA) +
                 dga * (1 - srcA)
             ) / dst.a;

    dst.b = (
                 std::max(sba * orgA, dba * srcA) +
                 sba * (1 - orgA) +
                 dba * (1 - srcA)
             ) / dst.a;
}

void hardLight(ColourFP& src, ColourFP& dst, double opacity) {
    double srcA = src.a * opacity;
    double orgA = dst.a;

    dst.a = dst.a + srcA - dst.a * srcA;

    double sra = src.r * srcA;
    double sga = src.g * srcA;
    double sba = src.b * srcA;

    double dra = dst.r * orgA;
    double dga = dst.g * orgA;
    double dba = dst.b * orgA;

    dst.r =
        (2 * sra <= srcA
         ? 2 * sra * dra + sra * (1 - orgA) + dra * (1 - srcA)
         : sra * (1 + orgA) + dra * (1 + srcA) - 2 * dra * sra - orgA * srcA) / dst.a;

    dst.g =
        (2 * sga <= srcA
         ? 2 * sga * dga + sga * (1 - orgA) + dga * (1 - srcA)
         : sga * (1 + orgA) + dga * (1 + srcA) - 2 * dga * sga - orgA * srcA) / dst.a;

    dst.b =
        (2 * sba <= srcA
         ? 2 * sba * dba + sba * (1 - orgA) + dba * (1 - srcA)
         : sba * (1 + orgA) + dba * (1 + srcA) - 2 * dba * sba - orgA * srcA) / dst.a;
}

void difference(ColourFP& src, ColourFP& dst, double opacity) {
    double srcA = src.a * opacity;
    double orgA = dst.a;

    dst.a = dst.a + srcA - dst.a * srcA;

    double sra = src.r * srcA;
    double sga = src.g * srcA;
    double sba = src.b * srcA;

    double dra = dst.r * orgA;
    double dga = dst.g * orgA;
    double dba = dst.b * orgA;

    dst.r = (sra + dra - 2 * std::min(sra * srcA, dra * srcA)) / dst.a;
    dst.g = (sga + dga - 2 * std::min(sga * srcA, dga * srcA)) / dst.a;
    dst.b = (sba + dba - 2 * std::min(sba * srcA, dba * srcA)) / dst.a;
}

void exclusion(ColourFP& src, ColourFP& dst, double opacity) {
    double srcA = src.a * opacity;
    double orgA = dst.a;

    dst.a = dst.a + srcA - dst.a * srcA;

    double sra = src.r * srcA;
    double sga = src.g * srcA;
    double sba = src.b * srcA;

    double dra = dst.r * orgA;
    double dga = dst.g * orgA;
    double dba = dst.b * orgA;

    dst.r =
        (
            sra * orgA +
            dra * srcA -
            2 * sra * dra +
            sra * (1 - orgA) +
            dra * (1 - srcA)
        ) / dst.a;

    dst.g =
        (
            sga * orgA +
            dga * srcA -
            2 * sga * dga +
            sga * (1 - orgA) +
            dga * (1 - srcA)
        ) / dst.a;
        
    dst.b =
        (
            sba * orgA +
            dba * srcA -
            2 * sba * dba +
            sba * (1 - orgA) +
            dba * (1 - srcA)
        ) / dst.a;
}
