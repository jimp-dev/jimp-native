/**
 * Ensures a given number is finite, not set to NaN and an integer.
 * 
 * @param number 
 */
export const ensureInteger = (number): number => {
    if (
        typeof number !== 'number' &&
        Number.isNaN(number) ||
        !Number.isFinite(number)
    ) {
        throw new Error(`Expected a valid number, received: ${number}`);
    }

    return Math.round(number);
};