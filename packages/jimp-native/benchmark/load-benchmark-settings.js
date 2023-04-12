const { BENCHMARK_STAGES } = require("./constants");

let stagesSelected = [...BENCHMARK_STAGES];
let benchmarkRepeat = 32;

function printStagesAvailable() {
  console.log(`Available stages are: ${BENCHMARK_STAGES.join(", ")}`);
}

for (let i = 0; process.argv.length > i; i++) {
  const arg = process.argv[i];

  if (arg === "--stages") {
    if (process.argv.length - 1 === i) {
      console.error(
        "Please specify desired stages (comma separated, no spaces) when using --stages."
      );
      printStagesAvailable();
      process.exit(1);
    }

    stagesSelected = process.argv[i + 1].split(",");

    for (const selectedStage of stagesSelected) {
      if (!BENCHMARK_STAGES.includes(selectedStage)) {
        console.error(
          `${selectedStage} is not a stage. Stages must be provided in a comma separated list (no spaces).`
        );
        printStagesAvailable();
        process.exit(1);
      }
    }
  }

  if (arg === "--repeat") {
    if (process.argv.length - 1 === i) {
      console.error("Please specify a repeat amount when using --repeat.");
      process.exit(1);
    }

    try {
      benchmarkRepeat = Math.abs(parseInt(process.argv[i + 1], 10));
    } catch (err) {
      console.error(`Please specify a valid number when using --repeat.`);
    }
  }
}

// Ensure stages marked with image size are sorted from small to big.
stagesSelected = stagesSelected.sort((a, b) => {
  try {
    return parseInt(a, 10) - parseInt(b, 10);
  } catch (err) {
    return 0;
  }
});

module.exports = {
  benchmarkRepeat,
  stages: stagesSelected,
};
