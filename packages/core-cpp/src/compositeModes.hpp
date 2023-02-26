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

void srcOver (ColourFP& src, ColourFP& dst, double opacity);

void dstOver (ColourFP& src, ColourFP& dst, double opacity);

void multiply (ColourFP& src, ColourFP& dst, double opacity);

void add (ColourFP& src, ColourFP& dst, double opacity);

void screen (ColourFP& src, ColourFP& dst, double opacity);

void overlay (ColourFP& src, ColourFP& dst, double opacity);

void darken (ColourFP& src, ColourFP& dst, double opacity);

void lighten (ColourFP& src, ColourFP& dst, double opacity);

void hardLight (ColourFP& src, ColourFP& dst, double opacity);

void difference (ColourFP& src, ColourFP& dst, double opacity);

void exclusion (ColourFP& src, ColourFP& dst, double opacity);