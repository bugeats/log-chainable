const chalk = require('chalk');
const stripAnsi = require('strip-ansi');

const handlers = {};

const consoleLevels = {
    debug: {
        color: 'gray',
        consoleMethod: 'log'
    },
    info: {
        color: 'blue',
        consoleMethod: 'info'
    },
    warn: {
        color: 'yellow',
        consoleMethod: 'warn'
    },
    error: {
        color: 'red',
        consoleMethod: 'error'
    }
};

// Minimal Console Colorized (default) -----------------------------------------

handlers.minimalConsoleColorized = function (level = 'info', nameStack = [], args = []) {
    const applyArgs = [
        colorize(`[${ level }]`, level),
        nameStack.length
            ? chalk.gray(`(${ nameStack.join('.') })`)
            : undefined
    ]
        .filter(x => x)
        .concat(args);

    console[consoleLevels[level].consoleMethod].apply(console, applyArgs); // eslint-disable-line no-console

    // handlers must always return a string
    return stripAnsi(applyArgs.join(' '));
};

// Minimal Console -------------------------------------------------------------

handlers.minimalConsole = function (level = 'info', nameStack = [], args = []) {
    const applyArgs = [
        `[${ level }]`,
        nameStack.length
            ? `(${ nameStack.join('.') })`
            : undefined
    ]
        .filter(x => x)
        .concat(args);

    console[consoleLevels[level].consoleMethod].apply(console, applyArgs); // eslint-disable-line no-console

    // handlers must always return a string
    return applyArgs.join(' ');
};

// ----

handlers.default = handlers.minimalConsoleColorized;

// -----------------------------------------------------------------------------

function colorize (str, level) {
    const color = consoleLevels[level] && consoleLevels[level].color;
    if (color && chalk[color]) {
        return chalk[color](str);
    }
    return str;
}

// ----

module.exports = handlers;
