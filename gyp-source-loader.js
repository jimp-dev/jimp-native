// Script that helps load all C++ sources into node gyp without having to add every file manually.
const path = require('path');
const fs = require('fs');

const SOURCE_LOCATION = path.join(__dirname, 'cppsrc');
const HEADER_FILE_EXTENSION = '.hpp';
const SOURCE_FILE_EXTENSION = '.cpp';

const result = [];

function searchRecursive(basePath) {
    for (const entryName of fs.readdirSync(basePath)) {
        const entryPath = path.join(basePath, entryName);
        if (fs.statSync(entryPath).isDirectory()) {
            searchRecursive(entryPath);
        } else {
            if (entryPath.endsWith(HEADER_FILE_EXTENSION) || entryPath.endsWith(SOURCE_FILE_EXTENSION)) {
                result.push(entryPath);
            }
        }
    }
}

searchRecursive(SOURCE_LOCATION);

console.log(
    result
        .map(filePath => path.relative(__dirname,  filePath).replace(/\\/g, '\\\\'))
        .join(' ')
);