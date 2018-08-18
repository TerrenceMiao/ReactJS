var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

var MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {

    devServer: {
        compress: true,
        disableHostCheck: true
    },

    entry: [
        './js/app'
    ],

    mode: "development",

    output: {
        path: path.join(__dirname, 'dist'), // Must be an absolute path
        filename: 'compiled.app.js',
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: __dirname,
                // Turn off the warning:
                //  [BABEL] Note: The code generator has deoptimised the styling of "/Users/terrence/Projects/ReactJS/auto-suggest/node_modules/react-dom/cjs/react-dom.development.js"
                //  as it exceeds the max of "500KB".
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, "css-loader"
                ]
            },
            {
                test: /\.jpg$/,
                loader: 'url?limit=8192' // 8kb
            },
            {
                test: /\.svg$/,
                loader: 'url?limit=8192!svgo' // 8kb
            }
        ]
    },

    resolve: {
        modules: [
            'node_modules',
            'js'
        ]
    },

    devtool: 'source-map',

    plugins: [
        new webpack.HotModuleReplacementPlugin(),

        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                postcss: [
                    autoprefixer
                ]
            }
        }),

        // Global environment configuration
        new webpack.DefinePlugin({
            ELASTICSEARCH_URL: JSON.stringify('http://0.0.0.0:9200')
        }),

        new MiniCssExtractPlugin({
            filename: "base.css",
            chunkFilename: "auto-suggest-base.css"
        })
    ]
};
