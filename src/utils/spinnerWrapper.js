import ora from 'ora';
import chalk from 'chalk';
import boxen from 'boxen';

/**
 * Wraps an async operation with a standardized console spinner and error handling.
 * @param {string} startMessage Message to show while spinning
 * @param {Function} promiseFunc The async operation returning data
 * @param {Function|string} successMessage Message or resolver function when successful
 * @returns {Promise<any|null>} The result, or null if it fails
 */
export async function withSpinner(startMessage, promiseFunc, successMessage = null) {
    const spinner = ora(startMessage).start();

    try {
        const result = await promiseFunc();
        if (successMessage) {
            if (typeof successMessage === 'function') {
                spinner.succeed(successMessage(result));
            } else {
                spinner.succeed(successMessage);
            }
        } else {
            spinner.stop(); // Stop without icon if none provided
        }
        return result;
    } catch (error) {
        spinner.fail(boxen(chalk.red(error.message), { padding: 1, borderColor: 'red' }));
        return null; // By returning null, the caller knows it failed without throwing
    }
}

/**
 * For operations that should handle failure by throwing so caller can abort differently.
 */
export async function withSpinnerStrict(startMessage, promiseFunc, successMessage = null) {
    const spinner = ora(startMessage).start();
    try {
        const result = await promiseFunc();
        if (successMessage) {
            spinner.succeed(typeof successMessage === 'function' ? successMessage(result) : successMessage);
        } else {
            spinner.stop();
        }
        return result;
    } catch (error) {
        spinner.fail(boxen(chalk.red(error.message), { padding: 1, borderColor: 'red' }));
        throw error;
    }
}
