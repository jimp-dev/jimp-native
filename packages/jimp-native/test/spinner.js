const SPINNER_FRAMES = [
    '●∙∙∙∙',
    '∙●∙∙∙',
    '∙∙●∙∙',
    '∙∙∙●∙',
    '∙∙∙∙●',
    '∙∙∙●∙',
    '∙∙●∙∙',
    '∙●∙∙∙'
];

const SPINNER_INTERVAL = 80;

let frame = -1;

/**
 * Returns the next spinner frame.
 */
function getFrame() {
    frame++;
    if (frame >= SPINNER_FRAMES.length) {
        frame = 0;
    }

    return SPINNER_FRAMES[frame];
}

module.exports = {
    getFrame,
    SPINNER_INTERVAL
};