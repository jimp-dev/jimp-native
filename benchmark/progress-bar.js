require('draftlog').into(console);
const chalk = require('chalk');

const STAGE_WIDTH = 4;
const TASK_WIDTH = 30;
const CONSTRUCTOR_WIDTH = 15;

const progressBarLine = console.draft();

let previousBarWidth = null;

module.exports = (percentage, subPercentage, constructor, stage, task) => {
    let result =  
        `${constructor.padEnd(CONSTRUCTOR_WIDTH, '.')}|` + 
        `${stage.padEnd(STAGE_WIDTH, '.')}|` + 
        `${task.padEnd(TASK_WIDTH, '.')}|`;

    const barWidth = process.stdout.columns - result.length - 2;

    if (previousBarWidth === null) {
        previousBarWidth = null;
    }

    if (previousBarWidth !== barWidth) {
        progressBarLine('');
    }

    previousBarWidth = barWidth;

    const filled = Math.round(percentage / 100 * barWidth);
    const remain = barWidth - filled;

    const filledYellow = Math.round(subPercentage / 100 * filled);
    const filledWhite = filled - filledYellow;

    const barCharacters = chalk.yellowBright('#'.repeat(filledYellow)) + chalk.reset(`#`.repeat(filledWhite)) + `.`.repeat(remain);

    result += '[' + barCharacters + ']';

    progressBarLine(result);
};
