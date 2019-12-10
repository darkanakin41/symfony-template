var Encore = require('@symfony/webpack-encore');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

// only needed for CDN's or sub-directory deploy
Encore.setManifestKeyPrefix('build/');

// directory where compiled assets will be stored
Encore.setOutputPath('public/build/');
// public path used by the web server to access the output path
Encore.setPublicPath('/build');

/*
 * ENTRY CONFIG
 *
 * Add 1 entry for each "page" of your app
 * (including one that's included on every page - e.g. "app")
 *
 * Each entry will result in one JavaScript file (e.g. app.js)
 * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
 */
Encore.addEntry('app', './assets/typescript/app.ts');
//.addEntry('page1', './assets/js/page1.js')
//.addEntry('page2', './assets/js/page2.js')

// When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
Encore.splitEntryChunks();

// will require an extra script tag for runtime.js
// but, you probably want this, unless you're building a single-page app
Encore.enableSingleRuntimeChunk();

/*
 * FEATURE CONFIG
 *
 * Enable & configure other features below. For a full
 * list of features, see:
 * https://symfony.com/doc/current/frontend.html#adding-more-features
 */
Encore.cleanupOutputBeforeBuild();
Encore.enableBuildNotifications();
Encore.enableSourceMaps(!Encore.isProduction());
// enables hashed filenames (e.g. app.abc123.css)
Encore.enableVersioning(Encore.isProduction());

// enables @babel/preset-env polyfills
Encore.configureBabel(() => {
}, {
    useBuiltIns: 'usage',
    corejs: 3
});

Encore.enableSassLoader();
Encore.enableVueLoader();
Encore.enableTypeScriptLoader((options) => {
    options.appendTsSuffixTo = [/\.vue$/]
});
Encore.enableForkedTypeScriptTypesChecking();


// uncomment to get integrity="..." attributes on your script & link tags
// requires WebpackEncoreBundle 1.4 or higher
Encore.enableIntegrityHashes(Encore.isProduction());

// uncomment if you're having problems with a jQuery plugin
//.autoProvidejQuery()

// uncomment if you use API Platform Admin (composer req api-admin)
//.enableReactPreset()
//.addEntry('admin', './assets/js/admin.js')

// Configuration related to webpack in relation with docker
if (!Encore.isProduction()) {
    Encore.disableCssExtraction();
    Encore.setPublicPath('https://node.{{DOCKER_DEVBOX_DOMAIN_PREFIX}}.{{DOCKER_DEVBOX_DOMAIN}}/build/');
}

const config = Encore.getWebpackConfig();

if (!Encore.isProduction()) {
    config.watchOptions = {
        poll: true,
    };
    config.devServer = {
        host: '0.0.0.0',
        port: '8080',
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        disableHostCheck: true,
        sockHost: 'node.{{DOCKER_DEVBOX_DOMAIN_PREFIX}}.{{DOCKER_DEVBOX_DOMAIN}}',
    };
}

module.exports = config;
