module.exports = (image, start, end) => {
  start();
  image.resize(
    image.getWidth() * 0.5,
    image.getHeight() * 0.5,
    "nearestNeighbour"
  );
  end();
};
