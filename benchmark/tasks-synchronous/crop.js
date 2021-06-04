module.exports = (image, start, end) => {
    start();
    image.crop(10, 10, image.getWidth() - 10, image.getHeight() - 10);
    end();
};
