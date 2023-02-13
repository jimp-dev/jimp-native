module.exports = (image, start, end) => {
  start();
  image.blur(10);
  end();
};
