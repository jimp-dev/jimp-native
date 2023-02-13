const EDGE_DETECT_KERNEL = [
  [-1, -1, -1],
  [-1, 8, -1],
  [-1, -1, -1],
];

module.exports = (image, start, end) => {
  start();
  image.convolution(EDGE_DETECT_KERNEL);
  end();
};
