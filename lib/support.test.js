const test = require('tape');

const support = require('./support');

test('support.pathBaseName basic js path', function (assert) {
    const result = support.pathBaseName('/home/bucky/dymaxion/hoverboard.js');
    assert.equal(result, 'hoverboard');
    assert.end();
});

test('support.pathBaseName basic js test path', function (assert) {
    const result = support.pathBaseName('/home/bucky/dymaxion/hoverboard.test.js');
    assert.equal(result, 'hoverboard.test');
    assert.end();
});

test('support.pathBaseName basic jsx path', function (assert) {
    const result = support.pathBaseName('/home/bucky/dymaxion/hoverboard.jsx');
    assert.equal(result, 'hoverboard');
    assert.end();
});

test('support.pathBaseName fuzz', function (assert) {
    const result = support.pathBaseName(`
                 .d8888b. 888
                d88P  Y88b888
                       888888
        888  888     .d88P888  888
        888  888 .od888P" 888 .88P
        888  888d88P"     888888K
        Y88b 888888"      888 "88b
         "Y88888888888888 888  888
             888
        Y8b d88P
         "Y88P"
    `);
    assert.equal(result, `
                 .d8888b. 888
                d88P  Y88b888
                       888888
        888  888     .d88P888  888
        888  888 .od888P" 888 .88P
        888  888d88P"     888888K
        Y88b 888888"      888 "88b
         "Y88888888888888 888  888
             888
        Y8b d88P
         "Y88P"
    `);
    assert.end();
});

test('support.pathBaseName windows path', function (assert) {
    const result = support.pathBaseName('C:\\GAMES\\GORILLA.BAS');
    assert.equal(result, 'GORILLA');
    assert.end();
});
