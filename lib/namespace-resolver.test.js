const test = require('tape');

const IS_BROWSER = (typeof window !== 'undefined');

const namespaceResolver = require('./namespace-resolver');

test('namespace resolver string arg', function (assert) {
    const result = namespaceResolver('shambala');
    assert.equal(result, 'shambala');
    assert.end();
});

test('namespace resolver function arg', function (assert) {
    function whatTimeIsIt () {
        return 'beer time';
    }
    const result = namespaceResolver(whatTimeIsIt);
    assert.equal(result, 'whatTimeIsIt');
    assert.end();
});

test('namespace resolver arguments arg', function (assert) {
    (function takeArgs () {
        const result = namespaceResolver(arguments);
        assert.equal(result, 'takeArgs("take", "my", 42)');
        assert.end();
    })('take', 'my', 42);
});

test('namespace resolver module arg', function (assert) {
    const result = namespaceResolver(module);
    if (IS_BROWSER) {
        assert.equal(result, 'Object');
    } else {
        assert.equal(result, 'namespace-resolver.test');
    }
    assert.end();
});
