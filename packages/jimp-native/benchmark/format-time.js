module.exports = (nanoseconds) => {
    if (nanoseconds > 1000000000) {
        return `${(nanoseconds / 1000000000).toFixed(2)}sec`;
    }

    if (nanoseconds > 1000000) {
        return `${(nanoseconds / 1000000).toFixed(2)}ms`;
    }

    if (nanoseconds > 1000) {
        return `${(nanoseconds / 1000).toFixed(2)}μs`;
    }

    return `${nanoseconds}ns`;
};
