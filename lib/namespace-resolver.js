function pathBaseName (pathStr) {
    const match = pathStr.match(
        /^(([A-Z]:)?[.]?[\\{1,2}/]?.*[\\{1,2}/])*(.+)\.(.+)/
    );
    if (match && match[3]) {
        return match[3];
    }
    return pathStr;
}

function isFunction (obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

function isWebpackModule (obj) {
    return obj instanceof module.constructor
        && (
            (module.webpackPolyfill !== undefined)
            || (module.hot !== undefined)
        );
}

function isNodeModule (obj) {
    return obj instanceof module.constructor
        && module.filename !== undefined;
}


// -----------------------------------------------------------------------------

// map argument given to namespace() to namespace string
function namespaceResolver (arg, quoteStrings = false) {
    if (Number.isInteger(arg)) {
        return arg.toString();
    }

    if (isNodeModule(arg)) {
        return pathBaseName(arg.filename);
    }

    if (isWebpackModule(arg)) {
        return `webpack-module-${module.id}`;
    }

    // process functions
    if (isFunction(arg)) {
        return arg.name;
    }

    // process arguments object
    if (isFunction(arg.callee)) {
        const calleeArgs = Array.prototype.slice.call(arg).map(x => namespaceResolver(x, true));
        return `${ arg.callee.name }(${ calleeArgs.join(', ') })`;
    }

    if (typeof arg === 'string') {
        if (quoteStrings) {
            return `"${arg}"`;
        }
        return arg;
    } else if (arg.constructor.name) {
        return arg.constructor.name;
    }

    return arg;
}

// -----------------------------------------------------------------------------

module.exports = namespaceResolver;
