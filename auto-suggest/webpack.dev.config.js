var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

    devServer: {
        compress: true,
        disableHostCheck: true
    },

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
                loader: 'babel-loader',
                include: __dirname
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style',
                    use: 'css?modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss!less'
                }),
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
            ELASTICSEARCH_URL: JSON.stringify('http://10.0.0.100:9200')
        }),

        new ExtractTextPlugin('base.css')
    ]
};
