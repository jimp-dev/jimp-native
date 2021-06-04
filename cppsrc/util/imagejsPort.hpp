#pragma once
#include "image.hpp"

typedef double (*InterpolationMethod) (double v0, double v1, double v2, double v3, double x);

double cubic(double v0, double v1, double v2, double v3, double x);

double hermite(double v0, double v1, double v2, double v3, double x);

double bezier(double v0, double v1, double v2, double v3, double x);

void complexInterpolation(Image& src, Image& dst, InterpolationMethod method);