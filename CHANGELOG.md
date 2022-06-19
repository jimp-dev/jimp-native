
# Changelog

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
