var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: [
        './js/app'
    ],

    output: {
        path: path.join(__dirname, 'dist'), // Must be an absolute path
        filename: 'compiled.app.js',
        publicPath: '/'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: __dirname
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(
                    'style',
                    'css?modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss!less'
                ),
                exclude: /node_modules/
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

    postcss: function() {
        return [autoprefixer];
    },

    resolve: {
        modulesDirectories: [
            'node_modules',
            'js'
        ]
    },

    devtool: 'source-map',

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('base.css')
    ]
};
