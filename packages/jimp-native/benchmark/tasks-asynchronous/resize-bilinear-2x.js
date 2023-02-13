module.exports = (image) => {
  return new Promise((resolve) => {
    image.resize(
      image.getWidth() * 2,
      image.getHeight() * 2,
      "bilinearInterpolation",
      resolve
    );
  });
};
