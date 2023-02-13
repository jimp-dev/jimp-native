const path = require("path");
const fs = require("fs");
const progressBar = require("./progress-bar");
const printSystemInfo = require("./print-system-info");
const {
  STAGE_INDENT,
  SYNC_TASKS_LOCATION,
  ASSETS_LOCATION,
} = require("./constants");
const settings = require("./load-benchmark-settings");
const formatTime = require("./format-time");

const TASKS = fs.readdirSync(SYNC_TASKS_LOCATION).map((taskName) => ({
  name: taskName.slice(0, -3),
  run: require(path.join(SYNC_TASKS_LOCATION, taskName)),
}));

const results = new Map();
let Jimp = require("jimp");
let constructorName = "jimp-js";
let basePercent = 0;

const PERCENT_PER_CONSTRUCTOR = 50;
const PERCENT_PER_STAGE = PERCENT_PER_CONSTRUCTOR / settings.stages.length;

async function runBenchmark() {
  for (let s = 0; settings.stages.length > s; s++) {
    const stage = settings.stages[s];
    const imagePath = path.join(ASSETS_LOCATION, `bench_${stage}.png`);
    // eslint-disable-next-line no-await-in-loop
    const image = await Jimp.read(imagePath);

    for (let t = 0; TASKS.length > t; t++) {
      const task = TASKS[t];
      let taskResults;
      if (results.has(task.name)) {
        taskResults = results.get(task.name);
      } else {
        taskResults = [];
        results.set(task.name, taskResults);
      }

      for (let i = 0; settings.benchmarkRepeat > i; i++) {
        let startTime = 0;
        const start = () => {
          startTime = process.hrtime.bigint();
        };

        let endTime = 0;
        const end = () => {
          endTime = process.hrtime.bigint();
        };

        const imageClone = image.clone();
        // eslint-disable-next-line no-await-in-loop
        await task.run(imageClone, start, end, Jimp);
        // eslint-disable-next-line no-delete-var
        delete imageClone; // Allow image copy to be GC'd quickly

        const nanoseconds = Number(endTime - startTime);

        progressBar(
          basePercent +
            (s / settings.stages.length) * PERCENT_PER_CONSTRUCTOR +
            ((t + 1) / TASKS.length) * PERCENT_PER_STAGE,
          ((i + 1) / settings.benchmarkRepeat) * 100,
          constructorName,
          stage,
          task.name
        );

        taskResults.push({
          task: task.name,
          constructor: constructorName,
          startTime,
          endTime,
          stage,
          nanoseconds,
        });
      }
    }
  }
}

async function runBenchmarks() {
  await runBenchmark();
  Jimp = require("../../..");
  constructorName = "jimp-native";
  basePercent = 50;
  await runBenchmark();
}

function printReport() {
  console.log(
    "\n================== FINAL REPORT (SINGLE THREADED) =================="
  );
  printSystemInfo();
  console.log(
    STAGE_INDENT,
    `BENCHMARK TASK REPEAT: ${settings.benchmarkRepeat}`
  );
  for (const task of TASKS) {
    console.log(`TASK: ${task.name}`);
    const jsResults = results
      .get(task.name)
      .filter((result) => result.constructor === "jimp-js");
    const nativeResults = results
      .get(task.name)
      .filter((result) => result.constructor === "jimp-native");

    for (const stage of settings.stages) {
      const jsAvg =
        jsResults
          .filter((result) => result.stage === stage)
          .map((result) => result.nanoseconds)
          .reduce((acc, cur) => acc + cur) / settings.benchmarkRepeat;

      const nativeAvg =
        nativeResults
          .filter((result) => result.stage === stage)
          .map((result) => result.nanoseconds)
          .reduce((acc, cur) => acc + cur) / settings.benchmarkRepeat;

      console.log(
        STAGE_INDENT,
        `STAGE: ${stage} ` +
          `JS AVERAGE: ${formatTime(jsAvg)} ` +
          `NATIVE AVERAGE: ${formatTime(nativeAvg)} ` +
          `SPEED IMPROVEMENT: ${(jsAvg / nativeAvg).toFixed(2)}x`
      );
    }
  }
}

runBenchmarks().then(printReport).catch(console.error);
