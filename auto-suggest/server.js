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

    // Error thrown when 
    // events.js:183
    //   throw er; // Unhandled 'error' event
    //   ^
    //
    // Error: spawn xdg-open ENOENT
    //     at _errnoException (util.js:992:11)
    //     at Process.ChildProcess._handle.onexit (internal/child_process.js:190:19)
    //     at onErrorNT (internal/child_process.js:372:16)
    //     at _combinedTickCallback (internal/process/next_tick.js:138:11)
    //     at process._tickCallback (internal/process/next_tick.js:180:9)
    //     at Function.Module.runMain (module.js:695:11)
    //     at startup (bootstrap_node.js:191:16)
    //     at bootstrap_node.js:612:3
    // npm ERR! code ELIFECYCLE
    // npm ERR! errno 1
    // npm ERR! Postal-Address-auto-suggest@0.0.1 start: `npm run watch & node server`
    // npm ERR! Exit status 1
    // npm ERR!
    // npm ERR! Failed at the Postal-Address-auto-suggest@0.0.1 start script.
    // npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

    // openUrl.open(url);
});
