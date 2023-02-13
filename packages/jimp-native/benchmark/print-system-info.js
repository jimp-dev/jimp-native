const os = require('os');

const INFO_INDENT = ' '.repeat(4);

module.exports = () => {
    console.log(`SYSTEM INFO:`);
    const cpus = os.cpus();
    console.log(INFO_INDENT, `CPU: ${cpus[0].model}`);
    console.log(INFO_INDENT, `CPU THREADS: ${cpus.length}`);
    const ram = os.totalmem();
    console.log(INFO_INDENT, `RAM: ${Math.floor(ram / 1024 / 1024)}MiB`);
};