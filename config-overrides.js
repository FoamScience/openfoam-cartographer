const webpack = require('webpack');

module.exports = function override(config, env) {
    config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
    };

    config.module.rules.unshift({
        test: /\.wasm$/,
        type: 'webassembly/async',
    });

    config.resolve.fallback = {
        fs: false,
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        process: require.resolve('process/browser'), // Polyfill for process
        buffer: require.resolve('buffer/'), // Polyfill for Buffer
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser', // Provide process in the browser
            Buffer: ['buffer', 'Buffer'], // Provide Buffer in the browser
        })
    );

    return config;
};
