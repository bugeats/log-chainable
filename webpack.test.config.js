const WebpackTapeRun = require('webpack-tape-run');
const path = require('path');
const glob = require('glob');

module.exports = {
    target: 'web',
    mode: 'production',
    entry: () => (
        glob.sync('./**/*.test.js', {
            ignore: './**/node_modules/**'
        })
    ),
    node: {
        fs: 'empty'
    },
    output: {
        path: path.resolve(__dirname, './output'),
        filename: 'test.js'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['*', '.js']
    },
    plugins: [
        new WebpackTapeRun({})
    ]
};
