'use strict';

const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = (env = {}) => {

    const config = {
        entry: [ path.resolve('src', 'app.ts') ],
        mode: env.development ? 'development' : 'production',
        target: 'node',
        externals: [nodeExternals()],
        devtool: env.development ? 'cheap-eval-source-map' : false,
        resolve: {
            extensions: [ '.ts', '.js' ],
            modules: [ 'node_modules', 'tests', 'src', 'package.json' ]
        },
        module: {
            rules: [
                { test: /\.ts$/, use: 'ts-loader' }
            ]
        },
        plugins: [
            new Dotenv()
        ]
    };

    if (env.nodemon) {
        config.watch = true;
        config.plugins.push(new NodemonPlugin());
    }

    return config;
};