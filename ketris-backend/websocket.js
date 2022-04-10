
var webSocketServer = require('websocket').server;

function launch_websocket_server( myWebserver ) {
    return wsServer = new webSocketServer({
        httpServer: myWebserver
    });
}
exports.launch_websocket_server = launch_websocket_server;