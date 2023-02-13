module.exports = (image, start, end) => {
    start();
    image.resize(image.getWidth() * 2, image.getHeight() * 2, 'bilinearInterpolation');
    end();
};
