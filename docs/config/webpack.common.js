const ExtractTextPlugin = require('extract-text-webpack-plugin');
const helpers = require('./helpers');
const fableUtils = require("fable-utils");

const isProduction = process.argv.indexOf("-p") >= 0;
console.log("Bundling for " + (isProduction ? "production" : "development") + "...");

const babelOptions = fableUtils.resolveBabelOptions({
    presets: [
        ["babel-preset-env", {
            "targets": {
                "browsers": [
                    "last 3 versions",
                    "ie >= 9"
                ]
            },
            "modules": false
        }]
    ],
    plugins: [
        ["transform-runtime", {
            "helpers": true,
            // We don't need the polyfills as we're already calling
            // cdn.polyfill.io/v2/polyfill.js in index.html
            "polyfill": false,
            "regenerator": false
        }],
        ["prismjs", {
            "languages": ["fsharp", "bash"],
            "theme": "default",
            "css": true
        }]
    ]
});
module.exports = {
    entry: {
        'index': helpers.root('./src/Fable.MaterialUI.Docs.fsproj'),
    },

    resolve: {
        modules: [
            "node_modules", helpers.root("./node_modules/")
        ]
    },

    module: {
        rules: [{
                test: /\.fs(x|proj)?$/,
                exclude: [ helpers.root("demos") ],
                use: {
                    loader: "fable-loader",
                    options: {
                        babel: babelOptions,
                        define: isProduction ? [] : ["DEBUG"]
                    }
                }
            },
            {
                test: /\.(fs|html)$/,
                include: [ helpers.root("demos") ],
                use: {
                    loader: "raw-loader"
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'raw-loader'
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions
                },
            },
            {
                test: /.sass$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ["css-loader", "sass-loader"]
                })
            },
            {
                test: /.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader' ]
                })
            }

        ]
    },
};
