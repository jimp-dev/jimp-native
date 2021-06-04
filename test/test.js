/**
 * Small custom testing harness that runs all tests with normal Jimp first, then injects the native Jimp functions
 * and runs them again. Compares the results between the two and expects outputs to be pretty much the same.
 * 
 * Tests reside in the tests/ folder and follow the following structure:
 * {
 *     name: String, // Test name, or the optimization being tested.
 *     tolerance: Number // Custom tolerance in exceptional cases.
 *     phases: [ // Different test phases to test various parameters to the optimization.
 *         {
 *              name: String // Phase name, should give a short description of the params being tested.
 *              type: Number // see test-constants for options.
 *              run: async (JimpConstructor, storageKey, bufferStore, imageStore) {
 *                  // Async function that takes:
 *                          - JimpConstructor, the version of Jimp to use during the test.
 *                          - storageKey, unique filename the test should use
 *                          - imageStore, instance of image-store.js the result image should be stored with it after the test
 *              }
 *         }
 *     ]
 * }
 * 
 * Tests themselves don't have to compare images between normal and native, the harness handles that. Tests may however
 * throw errors if something else goes wrong or if validation outside of equal image outputs is needed.
 */
const fs = require('fs');
const fsAsync = fs.promises;
const path = require('path');
const chalk = require('chalk');
const ImageStore = require('./image-store');
const testConstants = require('./test-constants');
const tests = require('./tests');
const { TestError, ComparisonError } = require('./errors');
const { getFrame, SPINNER_INTERVAL } = require('./spinner');
const { tmpDir, cleanExit } = require('./tmp-dir');

require('draftlog').into(console);

const errorsEncountered = [];

const imageStore = new ImageStore(tmpDir, testConstants.VISUAL_OUT_DIR);

/**
 * Runs all tests with the given Jimp constructor. Logs progress to console.
 * 
 * @param {Jimp|JimpNative} JimpConstructor 
 * @param {String} constructorName 
 */
async function runTestsWithConstructor(JimpConstructor, constructorName) {
    for (const test of tests) {
        const updateLog = console.draft(`(${chalk.gray(constructorName)}) ${chalk.yellow(test.name)} (${chalk.cyanBright(getFrame())})`);
        let currentPhaseName = '';

        // Updates the spinner every SPINNER_INTERVAL ms.
        const logUpdateInterval = setInterval(() => {
            updateLog(`(${chalk.gray(constructorName)}) ${chalk.yellow(test.name)} ${chalk.gray(currentPhaseName)} (${chalk.cyanBright(getFrame())})`);
        }, SPINNER_INTERVAL);


        for (const phase of test.phases) {
            const storageKey = `${test.name}-${phase.name}-${constructorName}`;
            currentPhaseName = phase.name;

            try {
                await phase.run(JimpConstructor, storageKey, imageStore);
            } catch (err) {
                clearInterval(logUpdateInterval);
                errorsEncountered.push(new TestError(err, test.name, phase.name, constructorName, phase.type !== testConstants.PHASE_TYPES.NO_THROW));
                console.log(`(${chalk.gray(constructorName)}) ${chalk.yellow(test.name)} ${chalk.gray(phase.name)} (${chalk.redBright('TEST ERROR')})`);
                continue;
            }
        }

        updateLog(`(${chalk.gray(constructorName)}) ${chalk.yellow(test.name)} (${chalk.green('Done')})`);

        clearInterval(logUpdateInterval);
    }

};

/**
 * Reads all bin files produced by the tests and compares the native ones with the Original JIMP output. 
 * 
 * Due to the fact that the C++ code tends to use integer arithmetic instead of standard JavaScript doubles and
 * that it sometimes opts for a slightly different algorithm, slight inaccuracies may occur. This is accounted for by 
 * the COLOUR_TOLERANCE constant. RGBA components may not differ more than COLOUR_TOLERANCE. Tests may override the
 * global tolerance value in exceptional cases.
 */
async function compareTestResults() {
    const updateLog = console.draft(`${chalk.yellow('Running binary comparisons...')}`);
    const updateInterval = setInterval(() => {
        updateLog(`${chalk.yellow('Running binary comparisons...')} (${chalk.cyanBright(getFrame())})`);
    }, SPINNER_INTERVAL);

    const imageBufferFiles = await fsAsync.readdir(tmpDir);

    for (const test of tests) {
        phaseLoop:
        for (const phase of test.phases) {
            const phaseKey = `${test.name}-${phase.name}`;
            const resultPair = imageBufferFiles
                .filter(fileName => fileName === `${phaseKey}-js.bin` || fileName === `${phaseKey}-native.bin`);

            if (resultPair.length !== 2) {
                // Only complain if no test failure occurred.
                if (errorsEncountered.filter(err => (err.testName === test.name && err.testPhase === phase.name)).length === 0) {
                    errorsEncountered.push(new ComparisonError(`One or both bin files are missing for test "${phaseKey}"`));
                }

                continue;
            }

            const [buffer1, buffer2] = await Promise.all([
                fsAsync.readFile(path.join(tmpDir, resultPair[0])),
                fsAsync.readFile(path.join(tmpDir, resultPair[1]))
            ]);


            if (buffer1.length !== buffer2.length) {
                const lengthDifference = Math.abs(buffer1.length - buffer2.length);
                errorsEncountered.push(
                    new ComparisonError(
                        `Outputs from "${phaseKey}" differ in length by ${lengthDifference} bytes, ` +
                            `or ${lengthDifference / 4} pixels.`
                    )
                );
    
                continue phaseLoop;
            }

            const COMPONENT_MAP = {
                0: 'Red',
                1: 'Green',
                2: 'Blue',
                3: 'Alpha'
            };

            for (let i = 0; buffer1.length > i; i++) {
                const diff = Math.abs(buffer1[i] - buffer2[i]);
                if (diff > (test.tolerance || testConstants.COLOUR_TOLERANCE)) {

                    if (i < 4 && (test.name === 'composite' || phase.name === 'composite')) {
                        // HACK: Jimp (JS) as a bug in composite where the first pixel is not handled correctly.
                        // TODO: Tell Jimp about it.
                        continue;
                    }

                    if (phaseKey === 'colour-convolution-gaussian-blur-edge-wrap') {
                        // HACK: Jimp (JS) has a bug in the pixel index code when edge wrapping, messing up this comparison.
                        // TODO: Tell Jimp about it: https://github.com/oliver-moran/jimp/pull/956
                        continue;
                    }

                    errorsEncountered.push(new ComparisonError(
                        `Pixel components from "${phaseKey}" differ by more than ${test.tolerance || testConstants.COLOUR_TOLERANCE}.\n` +
                        `First error encountered at byte index: ${i}. Difference: ${diff}. Component: ${COMPONENT_MAP[i % 4]}`)
                    );
                    continue phaseLoop;
                }
            }
        }
    }

    clearInterval(updateInterval);
    updateLog(`${chalk.yellow('Running binary comparisons...')} (${chalk.green('Done')})`);
}

/**
 * Prints all errors that occurred during testing
 */
function printReport() {
    console.log(`${chalk.yellow('Final test report:')}`);

    if (errorsEncountered.length === 0) {
        console.log(chalk.green('All tests passed. Native functions match original within tolerances.\n'));
        console.log(chalk.green('PASS'));
        return;
    }

    for (const err of errorsEncountered) {
        if (err instanceof TestError) {
            if (err.unexpected) {
                console.log(
                    `===== ${chalk.underline.redBright('UNEXPECTED TEST ERROR')} =====\n` +
                    `Test: ${err.testName} Phase: ${err.testPhase}\n` +
                    err.originalError + '\n' +
                    '================================\n'
                );
            } else {
                console.log(
                    `========== ${chalk.redBright('TEST ERROR')} ==========\n` +
                    `Test: ${err.testName} Phase: ${err.testPhase}\n` +
                    err.originalError + '\n' +
                    '================================\n'
                );
            }
        } else if (err instanceof ComparisonError) {
            console.log(
                `====== ${chalk.yellow('COMPARISON FAILURE')} ======\n` +
                err.toString() + '\n' +
                '================================\n'
            );
        }
    }

    console.log(chalk.redBright('FAILURE'));
}

const OriginalJimp = require('jimp');
runTestsWithConstructor(OriginalJimp, 'js')
    .then(() => {
        const NativeJimp = require('../true-async');
        return runTestsWithConstructor(NativeJimp, 'native');
    })
    .then(() => {
        return compareTestResults();
    })
    .then(() => {
        printReport();
        if (errorsEncountered.length > 0) {
            cleanExit(1);
        } else {
            cleanExit(0);
        }
    })
    .catch((err) => {
        console.error(err);
        cleanExit(1);
    });
