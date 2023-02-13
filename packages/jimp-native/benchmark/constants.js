const fs = require('fs');
const path = require('path');

const ASSETS_LOCATION = path.join(__dirname, 'assets');

module.exports = {
    ASSETS_LOCATION,
    BENCHMARK_STAGES: fs
        .readdirSync(ASSETS_LOCATION)
        .filter(file => file.startsWith('bench_') && file.endsWith('.png'))
        .map(file => file.replace('bench_', ''))
        .map(file => file.replace('.png', '')),
    SYNC_TASKS_LOCATION: path.join(__dirname, 'tasks-synchronous'),
    ASYNC_TASKS_LOCATION: path.join(__dirname, 'tasks-asynchronous'),
    STAGE_INDENT: '    '
};
