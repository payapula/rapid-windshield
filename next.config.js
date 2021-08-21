const withTM = require('next-transpile-modules');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer(
    withTM(['lodash'])({
        images: {
            domains: ['source.unsplash.com', 'firebasestorage.googleapis.com']
        },
        transpileModules: ['lodash']
    })
);
