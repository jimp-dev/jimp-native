const build = process.env.JIMP_NATIVE_TEST_STAGE || 'Release';
const addon = require(`../build/${build}/jimp-native.node`);
const debug = require('./debug');

if (debug.isDebugOn()) {
    // Introduce debug wrappers so we can log native addon calls and their execution time.
    for (const nativeMethodName of Object.keys(addon)) {
        const nativeMethod = addon[nativeMethodName];
        addon[nativeMethodName] = function (...args) {
            debug.log(`Native call to: "${nativeMethodName}".`);
            const startTime = process.hrtime.bigint();
            nativeMethod(...args);
            const totalTime = process.hrtime.bigint() - startTime;
            debug.log(`Native call to "${nativeMethodName}" took: ${(Number(totalTime) / 1000000).toFixed(2)}ms`);
        };
    }
}

module.exports = addon;