module.exports = async (image) => {
  return new Promise((resolve) => {
    image.rotate(90, resolve);
  });
};
