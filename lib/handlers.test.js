const test = require('tape');

const handlers = require('./handlers');

const isFunction = (obj) => !!(obj && obj.constructor && obj.call && obj.apply);

test('handlers smoketest', function (assert) {
    [
        'default',
        'minimalConsole',
        'minimalConsoleColorized'
    ].forEach(fnName => {
        assert.ok(isFunction(handlers[fnName]), `'${ fnName }' is a function`);
    });

    assert.end();
});
