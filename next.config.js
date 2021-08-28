const { StatsWriterPlugin } = require('webpack-stats-plugin');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
});

// From https://github.com/FormidableLabs/webpack-stats-plugin/blob/main/test/scenarios/webpack5/webpack.config.js
const STAT_RESET = Object.freeze({
    // webpack5+ needs explicit declaration.
    errors: true,
    warnings: true,
    // fallback for new stuff added after v3
    all: false,
    // explicitly turn off older fields
    // (webpack <= v2.7.0 does not support "all")
    // See: https://webpack.js.org/configuration/stats/
    performance: false,
    hash: false,
    version: false,
    timings: false,
    entrypoints: false,
    chunks: false,
    chunkModules: false,
    cached: false,
    cachedAssets: false,
    children: false,
    moduleTrace: false,
    assets: false,
    modules: false,
    publicPath: false
});

module.exports = withBundleAnalyzer({
    images: {
        domains: ['source.unsplash.com', 'firebasestorage.googleapis.com']
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Note: we provide webpack above so you should not `require` it
        // Perform customizations to webpack config

        // //https://webpack.js.org/configuration/devtool/#devtool
        // config.devtool = 'source-map';
        // // For debugging
        // config.mode = 'development';
        // For easier debugging to know what is contained in chunks
        // config.optimization.minimize = false;

        // This would function would be called twice - one for server and other for client,
        // so isServer flag would be true on server bundles
        if (!isServer) {
            // We need stats file only for client bundle
            // Source - https://relative-ci.com/documentation/setup/agent/cli/webpack/next
            // Check the docs https://github.com/FormidableLabs/webpack-stats-plugin
            // https://webpack.js.org/configuration/stats/#stats
            // https://webpack.js.org/api/node/#stats-object
            config.plugins.push(
                // Write out stats file to build directory.
                new StatsWriterPlugin({
                    filename: 'stats-without-transform.json', // Default
                    stats: Object.assign({}, STAT_RESET, {
                        assets: true,
                        entrypoints: true,
                        chunks: true,
                        modules: true
                    })
                })
            );
        }
        // Important: return the modified config
        return config;
    }
});
