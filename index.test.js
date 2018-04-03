const test = require('tape');

const logChainable = require('./index');
const logChainableHandlers = require('./handlers');

test('module public interface ok', function (assert) {
    assert.ok(logChainable);
    assert.ok(logChainableHandlers);
    assert.end();
});
