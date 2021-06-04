module.exports = (image) => {
    return new Promise ((resolve) => {
        image.blur(10, resolve);
    });
};
