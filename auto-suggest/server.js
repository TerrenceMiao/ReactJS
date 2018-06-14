var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server');

var openUrl = require('openurl');

var config = require('./webpack.dev.config')

var host = process.env.NODE_HOST || '0.0.0.0';
var port = process.env.NODE_PORT || 3000;

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath
}).listen(port, host, function(error) {
    if (error) {
        console.error(error); // eslint-disable-line no-console
        process.exit(1);
    }

    var url = `http://${host}:${port}/index.html`;

    console.log('==> 🌎 Listening on port %s. Open up %s in your browser.', port, url);

    openUrl.open(url);
});
