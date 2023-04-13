<div align="center">
  <img width="200" height="200" src="https://raw.githubusercontent.com/sjoerd108/jimp-native/b62679c91a8011abc0970761ba29b0935b1837b5/assets/jimp_native_logo.png">
  <h1>Jimp Native</h1>
  <p>Make your sever-side Jimp code run 10x faster!</p>
</div>

Jimp-native is a fast C++ re-implementation of [Jimp](https://github.com/jimp-dev/jimp)

# Installation

 Run `npm install jimp-native` in your existing project and `import Jimp from 'jimp-native'`. Jimp native aims to be a drop-in replacement for Jimp. If your code is already working with Jimp it should also work with Jimp native. If you need even more performance, check out [Multithreading](#Multithreading)

# Multithreading

It's highly recommended to use the asynchronous version of an image operation where possible.

Depending on how you call Jimp native methods, calls will be either singlethreaded or multithreaded. There's two ways to have the library run in multithreaded mode for a given operation:
 - This library ships an `Async` version of each method (e.g. `resize` becomes `resizeAsync`) these methods return a promise and also cause said operation to run on another thread.
 - If you provide a callback to any covered image operation, that method will run on another thread.

# Documentation

See [Jimp's](https://github.com/jimp-dev/jimp) documentation, this library should function the same way. The only difference you'll need to keep in mind is that any `Async` version of a call returns a promise and does not expect a callback function.

# Accuracy

Jimp native aims to be visually indistinguishable from Jimp. Tests are usually kept to a ∓ 0.392% tolerance for each colour component of a pixel. There are cases where the tolerances are set higher, notably `blur` and some `resize` algorithms. Reasoning for this usually comes down to speed benefits of using another algorithm or using integer arithmetic over JavaScript doubles. In any case, unless you need 100% accuracy on a binary level, using this library should be fine output-wise.

# Coverage
The following Jimp plugins/functions have been optimized with this library:

* composite ✅
* blit ✅
* blur ✅
* circle ✅
* colour 🟨
  * brightness ✅
  * contrast ✅
  * posterize ✅
  * grayscale/greyscale ✅
  * opacity ✅
  * sepia ✅
  * fade ✅
  * convolution ✅
  * opaque ✅
  * pixelate ✅
  * convolute ✅
  * colour/color ⛔
* contain 🟨 (uses resize internally so it's covered)
* cover 🟨 (crop and resize internally so it's covered)
* crop ✅
  * crop ✅
  * autocrop ✅
* displace ⛔
* dither ✅
  * dither16 ✅
  * dither565 ✅
* fisheye ⛔
* gaussian ⛔ (can be done by using convolution for now, or just using blur if a true gaussian blur isn't required)
* invert ✅
* mask ✅
* normalize ⛔
* print 🟨 (uses blit internally so it's covered)
* resize ✅
* rotate ✅
* scale 🟨 (uses resize internally so it's covered)
* shadow ⛔
* threshold ⛔

# Performance

The following numbers are some samples from a benchmark on a `Core i9-13900K` using a 512x512 image. You can find the benchmark code and all results with differing image sizes in the [benchmark folder](https://github.com/sjoerd108/jimp-native/tree/move-preparations/packages/jimp-native/benchmark).

## Singlethreaded
Operations using the synchronous API

| Operation                   | avg. time Jimp | avg. time Jimp native |
|-----------------------------|----------------|-----------------------|
| Gaussian blur convolution   | 149.08ms       | 22.42ms               |
| Rotate 90deg                | 11.25ms        | 1.77ms                |
| Crop                        | 3.26ms         | 180.84μs              |
| Default resize 2x           | 17.95ms        | 15.40ms               |
| Bicubic resize 2x           | 59.44ms        | 18.19ms               |
| Nearest neighbour resize 2x | 18.04ms        | 1.55ms                |

## Multithreaded
Operations using the callback/async API (32 calls launched at the same time). Imagine a busy web server handling tons of requests at once.
> Only jimp native is able to use multiple threads out of the box, so note that while the benchmark runs the same code on both implementations, only jimp native is actually multithreading in these examples. In other words, the more cores your CPU has the more drastic the improvement.

| Operation                   | time taken Jimp | time taken Jimp native |
|-----------------------------|-----------------|------------------------|
| Gaussian blur convolution   | 4.73sec         | 56.52ms                |
| Rotate 90deg                | 401.64ms        | 14.73ms                |
| Crop                        | 105.03ms        | 1.90ms                 |
| Default resize 2x           | 589.60ms        | 49.05ms                |

# // TODO

Here are some things I'd like to look into doing with this project:

* Implement remaining Jimp plugins / functions
* Handle image decoding in C++
* Build WASM version
* Improve the testing harness and benchmarking tool

# Licensing

Most C++ optimized functions are based on their JavaScript equivalents in [Jimp](https://github.com/oliver-moran/jimp/tree/master/packages). Jimp and Jimp native are both available under the MIT license. For the original license, see [ORIGINAL_JIMP_LICENSE](https://github.com/sjoerd108/jimp-native/blob/main/ORIGINAL_JIMP_LICENSE), for the license that applies to this port, see [LICENSE](https://github.com/sjoerd108/jimp-native/blob/main/LICENSE).

Jimp also contains portions of source code from other projects. C++ ports of this code will be marked with licensing info where applicable. External projects that have been partially ported to work with Jimp native include:

  * [ImageJS](https://github.com/guyonroche/imagejs) - All resize algorithms except the default bilinear algorithm are from this project. ImageJS is available under the MIT license (See [IMAGEJS_LICENSE](https://github.com/sjoerd108/jimp-native/blob/main/IMAGEJS_LICENSE)). Links: [C++ source](https://github.com/jimp-dev/jimp-native/blob/main/packages/plugin-resize-cpp/src/imageJsPort.hpp), [Jimp source](https://github.com/jimp-dev/jimp/blob/v0.22.7/packages/plugin-resize/src/modules/resize2.js), [Original source](https://raw.githubusercontent.com/guyonroche/imagejs/master/lib/resize.js).
  * [JS-Image-Resizer](https://github.com/taisel/JS-Image-Resizer) - Jimp will use the resize algorithm from this project when no algorithm is specified (this is not the same algorithm as when ``'bilinearInterpolation'`` is specified). JS-Image-Resizer is in the public domain. Links: [C++ source](https://github.com/jimp-dev/jimp-native/blob/main/packages/plugin-resize-cpp/src/jsImageResizerPort.hpp), [Jimp source](https://github.com/jimp-dev/jimp/blob/v0.22.7/packages/plugin-resize/src/modules/resize.js), [Original source](https://raw.githubusercontent.com/taisel/JS-Image-Resizer/master/resize.js).