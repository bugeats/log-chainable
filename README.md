# log-chainable

A utility for organizing javascript log statements into namespaces. Why? Because reading pages random logs sucks, and you're too lazy/smart to annotate each statement.

## Installation

    npm install log-chainable


## Basic Usage

The most basic usage:

```javascript
const log = require('log-chainable');

log('hi mom'); // [info] hi mom
log.warn('bye mom'); // [warn] hi mom
```

Using namespaces:

```javascript
const log = require('log-chainable');

log.namespace('greetings').namespace('family');

log('hi mom'); // [info] (greetings.family) hi mom
```

Namespaces are smart:

```javascript
// greeter.js

const log = require('log-chainable');

log.namespace('myApp', 'utils', module);

log('hi mom'); // [info] (myApp.utils.greeter) hi mom
```


## Handlers

Each namespace can have it's own handler:

```javascript
const log = require('log-chainable');

log.namespace('myApp', 'mySpecialModule')
    .handler(function myHandler (level, nameStack, args) {
        process.stdout.write(`myHandler: ${ level } ${ nameStack.join('/') } ${ args.join(', ') }\n`);
    });

log.namespace('myApp')('one', 'two'); // [info] (myApp) hi mom
log.namespace('myApp', 'mySpecialModule')('one', 'two'); // myHandler: info myApp/mySpecialModule one, two
```

Handlers cascade to child namespaces:

```javascript
const log = require('log-chainable');

log.namespace('myApp', 'mySpecialModule')
    .handler(function myHandler (level, nameStack, args) {
        process.stdout.write(`myHandler: ${ level } ${ nameStack.join('/') } ${ args.join(', ') }\n`);
    });

log.namespace('myApp')('one', 'two'); // [info] (myApp) hi mom
log.namespace('myApp', 'mySpecialModule')('one', 'two'); // myHandler: info myApp/mySpecialModule one, two
log.namespace('myApp', 'mySpecialModule', 'mySpecialChildModule')('three', 'four'); // myHandler: info myApp/mySpecialModule/mySpecialChildModule three, four
```

log-chainable comes with some handlers included:

```javascript
const log = require('log-chainable');
const handlers = require('log-chainable/handlers');

const myAppLogger = log.namespace('myApp').handler(handlers.default);

myAppLogger
    .namespace('colorfulModule')
    .handler(handlers.minimalConsoleColorized);

myAppLogger
    .namespace('dullModule')
    .handler(handlers.minimalConsole);
```


## The Default Handler

The default handler is a minimalist call to console.log with some extra colorization.

The default handler will hide `.debug()` calls unless the `DEBUG` environment variable is set.

```javascript
const log = require('log-chainable');
const handlers = require('log-chainable/handlers');

// this equivalent is already set for you
log.handler(handlers.default)

process.env['DEBUG'] = undefined;
log.debug('beep beep beep'); // <nothing happens>

process.env['DEBUG'] = 'true';
log.debug('beep beep beep'); // [debug] beep beep beep
```


## List of Available Handlers

- `handlers.minimalConsoleColorized` aka the default handler
- `handlers.minimalConsole` same as above with no color

Feel free to contribute more. Speaking of ...


# Contributing

Just please run the tests and linter.

    npm run check
