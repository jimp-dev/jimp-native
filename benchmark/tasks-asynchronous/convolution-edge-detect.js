const GAUSSIAN_KERNEL = [
    [ 1 / 256, 4  / 256, 6  / 256, 4  / 256, 1 / 256 ],
    [ 4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256 ],
    [ 6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256 ],
    [ 4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256 ],
    [ 1 / 256, 4  / 256, 6  / 256, 4  / 256, 1 / 256 ]
];

module.exports = (image) => {
    return new Promise ((resolve) => {
        image.convolution(GAUSSIAN_KERNEL, resolve);
    });
};
