const path = require('path');
const fs = require('fs');
const progressBar = require('./progress-bar');
const printSystemInfo = require('./print-system-info');
const { STAGE_INDENT, ASYNC_TASKS_LOCATION, ASSETS_LOCATION } = require('./constants');
const settings = require('./load-benchmark-settings');
const formatTime = require('./format-time');

const TASKS = fs.readdirSync(ASYNC_TASKS_LOCATION).map((taskName) => ({
    name: taskName.slice(0, -3),
    run: require(path.join(ASYNC_TASKS_LOCATION, taskName))
}));

const results = new Map();
let Jimp = require('jimp');
let constructorName = 'jimp-js';
let basePercent = 0;

const PERCENT_PER_CONSTRUCTOR = 50;
const PERCENT_PER_STAGE = PERCENT_PER_CONSTRUCTOR / settings.stages.length;

function nextTick () {
    return new Promise ((resolve) => {
        setImmediate(resolve);
    });
}

async function runBenchmark() {
    for (let s = 0; settings.stages.length > s; s++) {
        const stage = settings.stages[s];
        const imagePath = path.join(ASSETS_LOCATION, `bench_${stage}.png`);
        const image = await Jimp.read(imagePath);

        for (let t = 0; TASKS.length > t; t++) {
            const task = TASKS[t];
            let taskResults;
            if (!results.has(task.name)) {
                taskResults = [];
                results.set(task.name, taskResults);
            } else {
                taskResults = results.get(task.name);
            }

            let runsFinished = 0;
            let lowestStartTime = Infinity;
            let highestEndTime = 0;

            const runOnce = async () => {
                const imageClone = image.clone();
                await nextTick(); // Make sure we don't get stuck on Jimp js's sync code before we hit Promise.all

                const startTime = process.hrtime.bigint();
                if (startTime < lowestStartTime) {
                    lowestStartTime = startTime;
                }

                await task.run(imageClone);

                highestEndTime = process.hrtime.bigint();
    
                runsFinished++;
                progressBar(
                    basePercent + s / settings.stages.length * PERCENT_PER_CONSTRUCTOR + (t + 1) / TASKS.length * PERCENT_PER_STAGE,
                    runsFinished / settings.benchmarkRepeat * 100,
                    constructorName,
                    stage,
                    task.name
                );

                // eslint-disable-next-line no-delete-var
                delete imageClone; // Allow image copy to be GC'd quickly.
            };

            const jobs = [];
            for (let i = 0; settings.benchmarkRepeat > i; i++) {
                jobs.push(runOnce());
            }

            await Promise.all(jobs);

            taskResults.push({
                task: task.name,
                constructor: constructorName,
                stage,
                nanoseconds: Number(highestEndTime - lowestStartTime)
            });
        };
    }
}


async function runBenchmarks() {
    await runBenchmark();
    Jimp = require('../true-async');
    constructorName = 'jimp-native';
    basePercent = 50;
    await runBenchmark();
}

function printReport () {
    console.log('\n================== FINAL REPORT (MULTI THREADED) ==================');
    printSystemInfo();
    console.log(STAGE_INDENT, `BENCHMARK TASK REPEAT: ${settings.benchmarkRepeat}`);
    for (const task of TASKS) {
        console.log(`TASK: ${task.name}`);
        const jsResults = results.get(task.name).filter(result => result.constructor === 'jimp-js');
        const nativeResults = results.get(task.name).filter(result => result.constructor === 'jimp-native');

        for (const stage of settings.stages) {
            const jsResult = jsResults.find(result => result.stage === stage);
            const nativeResult = nativeResults.find(result => result.stage === stage);

            console.log(
                STAGE_INDENT,
                `STAGE: ${stage} ` + 
                `JS (${settings.benchmarkRepeat} CALLS): ${formatTime(jsResult.nanoseconds)} ` + 
                `NATIVE (${settings.benchmarkRepeat} CALLS): ${formatTime(nativeResult.nanoseconds)} ` + 
                `SPEED IMPROVEMENT: ${(jsResult.nanoseconds / nativeResult.nanoseconds).toFixed(2)}x`);
        }        
    }
}

runBenchmarks().then(printReport).catch(console.error);
