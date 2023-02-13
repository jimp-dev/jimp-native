module.exports = (image, start, end) => {
    const copy = image.clone().resize(image.getWidth() / 2, image.getHeight() / 2, 'nearestNeighbour');
    start();
    image.composite(copy, 30, 30);
    end();
};
