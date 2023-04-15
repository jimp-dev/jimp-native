
# Changelog

## V0.1.0-alpha.8 - 2023-04-15

- Fixed build issues on Windows
- Fixed a bug where rotating by a multiple of 90 degrees would resize the image slightly

## V0.1.0-alpha.7 - 2023-04-14

- Moved to official Jimp organization 🎉
- Use Jimp's official plugin system for optimized implementation overrides
- Added TypeScript typings
- Improved default resize algorithm
- Fixed a memory leak in convolution code

## v0.0.8 - 2022-10-22

- Updated upstream Jimp, fixing an NPM audit security warning.

## v0.0.7 - 2022-06-19

- Fixed build errors on MacOS (thanks [@liarco](https://github.com/liarco))

## v0.0.6 - 2022-06-18

- Fixed an issue with EDGE_WRAP mode for edge handling if negative x/y is more than the image width/height, which could
lead to reading outside the image buffer.
- Updated dependencies

## v0.0.5 - 2022-05-04

- Changed addon so that it's safe to use from within Node.js workers.
- Updated Node Addon API to v5 (Min node.js version is now v12)
- Updated node-gyp
- Added this changelog :)

## v0.0.4 - 2021-11-13

- Minor fixes to the C++ source code loader so that the module compiles properly on Windows.
- Updated packages

## v0.0.3 - 2021-06-07

- Added additional licensing information.

## v0.0.2 - 2021-06-05

- Move some node-gyp and the node-addon-api into dependencies instead of devDependencies

## v0.0.1 - 2021-06-05

- Initial public version on GitHub
