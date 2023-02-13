const EDGE_DETECT_KERNEL = [
  [-1, -1, -1],
  [-1, 8, -1],
  [-1, -1, -1],
];

module.exports = (image) => {
  return new Promise((resolve) => {
    image.convolution(EDGE_DETECT_KERNEL, resolve);
  });
};
