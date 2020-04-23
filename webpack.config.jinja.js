var Encore = require('@symfony/webpack-encore');

const sockHost = "node.{{core.domain.sub}}.{{core.domain.ext}}";
const projectUrl = "http://" + sockHost + "/";
const baseFolder = "public/";
const publicPath = "build/";

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

// the project directory where compiled assets will be stored
Encore.setOutputPath(baseFolder + publicPath);
// the public path used by the web server to access the previous directory
Encore.setPublicPath('/build');
Encore.setManifestKeyPrefix(publicPath);
Encore.enableSourceMaps(!Encore.isProduction());

/*
 * ENTRY CONFIG
 */
Encore.addEntry('app', './assets/typescript/App/app.ts');
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
    Encore.setPublicPath(projectUrl + publicPath);
}

const config = Encore.getWebpackConfig();

if (!Encore.isProduction()) {
    config.watchOptions = {
        poll: true,
    };
    config.devServer = {
        host: '0.0.0.0',
        port: 8080,
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        sockHost: sockHost,
        sockPort: 80,
        disableHostCheck: true
    };
}

module.exports = config;
