# Jimp native

## Make your sever-side Jimp code run 10x faster!

Jimp-native is a fast C++ re-implementation of [Jimp](https://github.com/oliver-moran/jimp/tree/master/packages) with zero system dependencies and minimal overhead!

## How do I start using it?

Simply run `npm install jimp-native` in your existing project and `require('jimp-native')`. Jimp native aims to be a drop-in replacement for Jimp. If your code is already working with Jimp it should also work with Jimp native. There is, however more you can do to speed up your image processing code.

## Multithreading

Ever notice how Jimp operations let you specify a callback? These are normally not actually async. If you load this library with ``require('jimp-native/true-async')`` they will be async if you supply a callback. By default Jimp native will keep 2 threads around for this and will automatically create more to meet demand (up to the amount of processor threads available.)

## Any system dependencies?

Aside from the usual build tools needed for node-gyp, nope! All algorithms are re-implemented by hand, only using the node-addon-api and what's in the C++ standard library.

## Accuracy

Jimp native aims to be visually indistinguishable from Jimp. Tests are usually kept to a ∓ 0.392% tolerance for each colour component (in other words a 0 - 255 component can be off by one). There are cases where the tolerances are set higher, notably `blur` and some `resize` algorithms. Reasoning for this usually comes down to speed benefits of using another algorithm or using integer arithmetic over JavaScript doubles. In any case, unless you need 100% accuracy on a binary level, using this library should be fine output-wise.

## Show me the numbers!

Single threaded performance sees a ~2x improvement in most areas (very small images yield much better improvements but this usually comes down to microseconds, so it's not fair to compare). Here are some common tasks you may do on a server and a comparing the two in single-threaded performance:
| Task                               | Jimp speed | Jimp native speed | Speed improvement |
|------------------------------------|------------|-------------------|-------------------|
| 2x resize (bilinear)               | 83.90ms    | 31.16ms           | 2.69x             |
| Edge detect convolution            | 98.43ms    | 27.00ms           | 3.65x             |
| Rotate by 90 degrees               | 28.66ms    | 7.35ms            | 3.90x             |
| 0.5 resize using default algo      | 8.87ms     | 4.71ms            | 1.88x             |
| Crop (10 px each side)             | 4.43ms     | 1.05ms            | 4.11x             |
| Gaussian blur convolution          | 399.59ms   | 57.54ms           | 6.94x             |

results shown above are from running these operations 15 times against 512 by 512 image and taking the average time. You can find the exact benchmark code used in the `benchmark/` folder. If you want to see more benchmarks and results on other image sizes then check the example-results file.

### It gets even better with multithreading

The numbers shown above are nice but this library really starts to shine when you allow your code to run asynchronously. Here's a comparison of the total time taken after starting 32 operations in parallel:

| Task                               | Jimp speed | Jimp native speed | Speed improvement |
|------------------------------------|------------|-------------------|-------------------|
| 2x resize (bilinear)               | 2.61sec    | 226.82ms          | 11.50x            |
| Edge detect convolution            | 12.98sec   | 409.89ms          | 31.67x            |
| Rotate by 90 degrees               | 956.47ms   | 59.16ms           | 16.17x            |
| Crop (10px each side)              | 129.95ms   | 11.67ms           | 11.14x            |
| Gaussian blur convolution          | 3.27sec    | 189.00ms          | 17.29x            |

Note: These results heavily depend on the CPU threads on your server. These results are from a benchmark ran on an Intel Core i7-6700K (4 cores, 8 threads) running at stock speed. You'll see better speeds with more cores and vice-versa. Again, check the benchmarks folder for more results.

Aside from raw throughput, another advantage of multithreading is that when your image operations are running on another thread, your Node.js main loop can work on other important things, like handling HTTP requests or talking to a database.

## What Jimp operations are currently covered?

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

## How can I use multithreading?

If you're already using callbacks and were using them as if they provided async behaviour, then you should be good to go. Here's an example of using the library in `true-async` mode:

```javascript
const Jimp = require('jimp-native/true-async');
const path = require('path');

function onDone(err, image) {
    console.log(`Circularize done.`);

    if (err) {
        console.error(err);
        return;
    }

    image.write(path.join(__dirname, 'result.png'), () => {
        console.log(`Done!`);
    });
}

Jimp
    .read(path.join(__dirname, 'example.png'))
    .then((image) => {
        console.log('Starting resize...');

        image.resize(128, 128, (err) => {
            console.log(`Resize done.`);

            if (err) {
                onDone(err);
            }

            console.log('Starting circle...');

            image.circle(onDone);

            console.log(`The main thread isn't blocking on circle!`);
        });

        console.log(`The main thread isn't blocking on resize!`);
    });
```

Alternatively, if you prefer async/await then you can use {methodName}Async for any optimized function available and use them as a promise:

```Javascript
const Jimp = require('jimp-native/true-async');
const path = require('path');

async function run () {
    const image = await Jimp.read(path.join(__dirname, 'example.png'));

    await image.resizeAsync(128, 128);
    await image.circleAsync();

    image.write(path.join(__dirname, 'result.png'), () => {
        process.exit(0);
    });
}

run().catch(console.error);

setInterval(() => {
    console.log('Main thread can do whatever it wants.');
}, 5);
```

Jimp native will automatically scale the amount of threads to meet demand. By default it'll keep 2 threads around if you use the async library. It'll spawn more threads temporarily if there's enough work queued up.

## //TODO

Here are some things I'd like to look into doing with this project:

* Implement remaining Jimp plugins / functions
* Handle image decoding in C++
* Explore potential port to web assembly (I'm not familiar with WASM, I'm not sure how feasible it is)
* Optimize default resize algorithm further (It beats JS, but it I feel like it can be a lot better)
* Improve the testing harness and benchmarking tool

## Licensing

Most C++ optimized functions are based on their JavaScript equivalents in [Jimp](https://github.com/oliver-moran/jimp/tree/master/packages). Jimp and Jimp native are both available under the MIT license. For the original license, see [ORIGINAL_JIMP_LICENSE](https://github.com/sjoerd108/jimp-native/blob/main/ORIGINAL_JIMP_LICENSE), for the license that applies to this port, see [LICENSE](https://github.com/sjoerd108/jimp-native/blob/main/LICENSE).

Jimp also contains portions of source code from other projects. C++ ports of this code will be marked with licensing info where applicable. External projects that have been partially ported to work with Jimp native include:

  * [ImageJS](https://github.com/guyonroche/imagejs) - All resize algorithms except the default bilinear algorithm are from this project. ImageJS is available under the MIT license (See [IMAGEJS_LICENSE](https://github.com/sjoerd108/jimp-native/blob/main/IMAGEJS_LICENSE)). Links: [C++ source](https://github.com/sjoerd108/jimp-native/blob/main/cppsrc/util/imagejsPort.cpp), [Jimp source](https://raw.githubusercontent.com/oliver-moran/jimp/v0.16.1/packages/plugin-resize/src/modules/resize2.js), [Original source](https://raw.githubusercontent.com/guyonroche/imagejs/master/lib/resize.js).
  * [JS-Image-Resizer](https://github.com/taisel/JS-Image-Resizer) - Jimp will use the resize algorithm from this project when no algorithm is specified (this is not the same algorithm as when ``'bilinearInterpolation'`` is specified). JS-Image-Resizer is in the public domain. Links: [C++ source](https://github.com/sjoerd108/jimp-native/blob/main/cppsrc/util/jsImageResizerPort.cpp), [Jimp source](https://github.com/oliver-moran/jimp/blob/v0.16.1/packages/plugin-resize/src/modules/resize.js), [Original source](https://raw.githubusercontent.com/taisel/JS-Image-Resizer/master/resize.js).