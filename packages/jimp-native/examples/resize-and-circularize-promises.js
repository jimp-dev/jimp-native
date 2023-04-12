const Jimp = require("jimp-native");
const path = require("path");

async function run() {
  const image = await Jimp.read(path.join(__dirname, "example.png"));

  await image.resizeAsync(128, 128);
  await image.circleAsync();

  image.write(path.join(__dirname, "result.png"), () => {
    process.exit(0);
  });
}

run().catch(console.error);

setInterval(() => {
  console.log("Main thread can do whatever it wants.");
}, 5);
