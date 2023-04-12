// Deprecated way of importing this library in async mode
module.exports = require("./");

process.emitWarning("jimp-native/true-async is deprecated", {
  code: "TRUE_ASYNC_DEPRECATION",
  detail:
    "jimp-native has multithreading on by default, importing this library through jimp-native/true-async will be dropped in a future version. You can safely change your imports to just 'jimp-native'",
});
