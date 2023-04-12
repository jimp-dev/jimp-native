const Jimp = require("jimp-native");
const path = require("path");

function onDone(err, image) {
  console.log(`Circularize done.`);

  if (err) {
    console.error(err);
    return;
  }

  image.write(path.join(__dirname, "result.png"), () => {
    console.log(`Done!`);
  });
}

Jimp.read(path.join(__dirname, "example.png")).then((image) => {
  console.log("Starting resize...");

  image.resize(128, 128, (err) => {
    console.log(`Resize done.`);

    if (err) {
      onDone(err);
    }

    console.log("Starting circle...");

    image.circle(onDone);

    console.log(`The main thread isn't blocking on circle!`);
  });

  console.log(`The main thread isn't blocking on resize!`);
});
