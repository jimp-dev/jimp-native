const JimpConstants = require('@jimp/core/es/constants');

const BLEND_MODE_MAP = {
    [JimpConstants.BLEND_SOURCE_OVER]: 0,
    [JimpConstants.BLEND_DESTINATION_OVER]: 1,
    [JimpConstants.BLEND_MULTIPLY]: 2,
    [JimpConstants.BLEND_ADD]: 3,
    [JimpConstants.BLEND_SCREEN]: 4,
    [JimpConstants.BLEND_OVERLAY]: 5,
    [JimpConstants.BLEND_DARKEN]: 6,
    [JimpConstants.BLEND_LIGHTEN]: 7,
    [JimpConstants.BLEND_HARDLIGHT]: 8,
    [JimpConstants.BLEND_DIFFERENCE]: 9,
    [JimpConstants.BLEND_EXCLUSION]: 10
};

const RESIZE_MODE_MAP = {
    nearestNeighbor: 0,
    nearestNeighbour: 0, // Add UK alias for convenience.
    bilinearInterpolation: 1,
    bicubicInterpolation: 2,
    hermiteInterpolation: 3,
    bezierInterpolation: 4
};

module.exports = {
    JimpConstants,
    BLEND_MODE_MAP,
    RESIZE_MODE_MAP
};
