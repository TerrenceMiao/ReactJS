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
        './src/index.tsx'
    ],

    mode: "development",

    output: {
        path: path.join(__dirname, 'dist'), // Must be an absolute path
        filename: 'bundle.js',
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
            },
            {
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader" 
            },
            { 
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'
                enforce: "pre", 
                test: /\.js$/, 
                loader: "source-map-loader" 
            }
        ]
    },

    resolve: {
        modules: [
            'node_modules',
            'js'
        ],

        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    // Enable sourcemaps for debugging webpack's output
    devtool: 'source-map',

    // Prevent bundling of certain imported packages and instead retrieve these external dependencies at runtime. For 
    // example, to include libraries from a CDN instead of bundling it:
    externals: {

    },

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
