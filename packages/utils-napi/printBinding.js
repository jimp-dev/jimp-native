#!/usr/bin/env node

/**
 * Script that creates a binding.gypi file in the project it's required from.
 */
const fs = require("fs");
const path = require("path");

const binding = fs.readFileSync(path.join(__dirname, "binding.gypi"), "utf8");
fs.writeFileSync(path.join(process.cwd(), "binding.gypi"), binding);
