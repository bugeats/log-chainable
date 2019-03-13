const path = require('path');
const handlers = require('./handlers');

// ConfigNode privately represents a position in the namespace tree.
// It's used to track position, and get and set config values.

function ConfigNode (name, parent, config = {}) {
    this.name = name;
    this.parent = parent;
    this.config = config;
    this.children = {};
}

ConfigNode.prototype.isRoot = function () {
    return this.parent === undefined;
};

ConfigNode.prototype.addChild = function (child) {
    if (this.children[child.name]) {
        return this.children[child.name];
    }
    child.parent = this;
    this.children[child.name] = child;
    return this.children[child.name];
};

ConfigNode.prototype.setConfig = function (key, val) {
    this.config[key] = val;
    return this;
};

// ascend up the tree to get the first config key that is set
ConfigNode.prototype.getConfig = function (key, fallback) {
    let found;
    this.ascendToRoot((node, nextNode) => {
        if (node.config[key] === undefined) {
            nextNode();
        } else {
            found = node.config[key];
        }
    });
    return found === undefined
        ? fallback
        : found;
};

ConfigNode.prototype.mapAscend = function (hookFn = identity) {
    return this.reduceAscend((accu, node) => {
        accu.unshift(hookFn(node));
        return accu;
    }, []);
};

ConfigNode.prototype.reduceAscend = function (hookFn = identity, initAccu = []) {
    return (function recur (accu, node) {
        // ascent does not include root node
        if (!node.isRoot()) {
            const result = hookFn(accu, node);
            recur(result, node.parent);
        }
        return accu;
    })(initAccu, this);
};

ConfigNode.prototype.ascendToRoot = function (hookFn = identity) {
    return (function recur (node) {
        if (node) {
            hookFn(node, () => recur(node.parent));
        }
    })(this);
};

// -----------------------------------------------------------------------------

// The root node is global to the current process.
// It's set with the default config.

const root = new ConfigNode('root', undefined, {
    handler: handlers.default
});

// -----------------------------------------------------------------------------

// Chain represents an accessor for set of namespaces.
// It manages the public interface, and the pointer to the current ConfigNode.

function Chain (currentNode) {
    function bindLogLevel (level) {
        return function log () {
            const namepath = currentNode.mapAscend(n => n.name);
            const handler = currentNode.getConfig('handler', identity);
            const ret = handler(level, namepath, [].slice.call(arguments));
            return ret;
        };
    }

    const iface = bindLogLevel('info');

    // Public interface methods below ------------------------------------------

    iface.info = iface;
    iface.debug = bindLogLevel('debug');
    iface.warn = bindLogLevel('warn');
    iface.error = bindLogLevel('error');

    // create a new namespace
    iface.namespace = function () {
        const newNode = Array.prototype.slice.call(arguments)
            .map(processNamespaceArg)
            .reduce((node, arg) => {
                const child = new ConfigNode(arg);
                return node.addChild(child);
            }, currentNode);
        return new Chain(newNode);
    };

    // set current node's handler
    iface.handler = function (newHandlerFn) {
        currentNode.setConfig('handler', newHandlerFn);
        return iface;
    };

    return iface;
}

// -----------------------------------------------------------------------------

function identity (x) {
    return x;
}

function isFunction (obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

// map argument given to namespace() to namespace string
function processNamespaceArg (arg) {
    // process 'module' keyword
    if (arg instanceof module.constructor) {
        return path.basename(arg.filename, '.js');
    }

    // process functions
    if (isFunction(arg)) {
        return arg.name;
    }

    // process arguments object
    if (isFunction(arg.callee)) {
        const calleeArgs = Array.prototype.slice.call(arg).map(processNamespaceArg);
        return `${ arg.callee.name }(${ calleeArgs.join(', ') })`;
    }

    if (typeof arg === 'string') {
        return arg;
    } else if (arg.constructor.name) {
        return arg.constructor.name;
    }

    return arg;
}

// -----------------------------------------------------------------------------

module.exports = new Chain(root);
