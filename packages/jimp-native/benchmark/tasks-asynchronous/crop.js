module.exports = (image) => {
  return new Promise((resolve) => {
    image.crop(10, 10, image.getWidth() - 10, image.getHeight() - 10, resolve);
  });
};
