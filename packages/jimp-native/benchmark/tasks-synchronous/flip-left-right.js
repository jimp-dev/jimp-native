module.exports = (image, start, end) => {
    start();
    image.flip(true, false);
    end();
};
