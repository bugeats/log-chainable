const test = require('tape');

const log = require('./log');

const isFunction = (obj) => !!(obj && obj.constructor && obj.call && obj.apply);

test('module ok', function (assert) {
    assert.ok(isFunction(log));
    assert.ok(isFunction(log.debug));
    assert.ok(isFunction(log.info));
    assert.ok(isFunction(log.warn));
    assert.ok(isFunction(log.error));
    assert.ok(isFunction(log.namespace));
    assert.end();
});

test('basic usage', function (assert) {
    assert.equal(
        log('msg from root'),
        '[info] msg from root',
        'defaults info level basic usage'
    );
    assert.equal(
        log.debug('msg from root'),
        '',
        'explicit debug level basic usage'
    );
    assert.equal(
        log.info('msg from root'),
        '[info] msg from root',
        'explicit info level basic usage'
    );
    assert.equal(
        log.warn('msg from root'),
        '[warn] msg from root',
        'explicit info level basic usage'
    );
    assert.equal(
        log.error('msg from root'),
        '[error] msg from root',
        'explicit info level basic usage'
    );
    assert.end();
});

test('basic namespace chaining', function (assert) {
    assert.equal(
        log.namespace('alpha')('msg from alpha'),
        '[info] (alpha) msg from alpha',
        'namespace is represented'
    );
    assert.equal(
        log.namespace('alpha').namespace('beta')('msg from alpha.beta'),
        '[info] (alpha.beta) msg from alpha.beta',
        'namespace is represented'
    );
    assert.equal(
        log.namespace('alpha').namespace('beta').namespace('gamma').warn('msg here'),
        '[warn] (alpha.beta.gamma) msg here',
        'namespace is represented'
    );
    assert.end();
});

test('namespace with numerous args', function (assert) {
    assert.equal(
        log.namespace()('msg here'),
        '[info] msg here',
        'namespace is not included if undefined'
    );
    assert.equal(
        log.namespace('alpha', 'beta', 'gamma', 'delta')('msg here'),
        '[info] (alpha.beta.gamma.delta) msg here',
        'namespace is represented'
    );
    assert.end();
});

test('namespace using exotic args', function (assert) {
    function namedFunc () {
        return;
    }
    assert.equal(
        log.namespace(module)('msg here'),
        '[info] (log.test) msg here',
        'module adds current file name'
    );
    assert.equal(
        log.namespace(namedFunc)('msg here'),
        '[info] (namedFunc) msg here',
        'function as namespace arg uses function name'
    );
    assert.end();
});

test('basic set handler', function (assert) {
    log.namespace('epsilon').handler((level, nameStack, args) => {
        assert.equal(level, 'info');
        assert.deepEqual(nameStack, ['epsilon']);
        assert.deepEqual(args, ['one', 'two']);
        assert.end();
        return 'handler result';
    });

    assert.equal(
        log.namespace('epsilon')('one', 'two'),
        'handler result'
    );
});

test('handler cascading', function (assert) {
    assert.plan(9);

    const phiHandler = function (level, nameStack, args) {
        assert.equal(level, 'info');
        assert.deepEqual(args, ['one', 'two']);
        return 'handler result phi';
    };

    const chiHandler = function (level, nameStack, args) {
        assert.equal(level, 'info');
        assert.deepEqual(args, ['one', 'two']);
        return 'handler result chi';
    };

    log.namespace('phi').handler(phiHandler);
    log.namespace('phi', 'mu', 'chi').handler(chiHandler);

    assert.equal(
        log.namespace('phi')('one', 'two'),
        'handler result phi',
        'phi gets phi handler'
    );

    assert.equal(
        log.namespace('phi', 'mu')('one', 'two'),
        'handler result phi',
        'mu gets phi handler'
    );

    assert.equal(
        log.namespace('phi', 'mu', 'chi')('one', 'two'),
        'handler result chi',
        'chi gets chi handler'
    );
});

test('default handler debug behavior', function (assert) {
    assert.equal(
        log.debug('nope never'),
        '',
        'debug does not do anything'
    );

    process.env['DEBUG'] = 'true';

    assert.equal(
        log.debug('yes now'),
        '[debug] yes now',
        'debug prints ok'
    );

    assert.end();
});

test('namespaces function as arg', function (assert) {
    function myFunc () {
        return log.namespace('test', myFunc)('one', 'two');
    }

    assert.equal(
        myFunc(),
        '[info] (test.myFunc) one two'
    );

    assert.end();
});

test('namespaces class as arg', function (assert) {
    class MyClass {
        constructor () {
            this.log = log.namespace('test', this);
        }

        doThatThing () {
            return this.log('done');
        }
    }

    const myInstance = new MyClass();

    assert.equal(
        myInstance.doThatThing(),
        '[info] (test.MyClass) done'
    );

    assert.end();
});

test('namespace using arguments reference', function (assert) {
    function doNamedFunc () {
        assert.equal(
            log.namespace(arguments)('msg here'),
            '[info] (doNamedFunc(alpha, Object, Array)) msg here',
            'arguments adds function and arguments description'
        );
        assert.end();
    }
    doNamedFunc('alpha', { 'one': 1 }, []);
});

test('namespace using simple arguments reference', function (assert) {
    function doNamedFunc () {
        assert.equal(
            log.namespace(arguments)('msg here'),
            '[info] (doNamedFunc(alpha)) msg here',
            'arguments adds function and arguments description'
        );
        assert.end();
    }
    doNamedFunc('alpha');
});
