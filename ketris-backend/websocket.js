var webSocketServer = require('websocket').server;


/*
This function starts the Websocket server.

myWebserver: Reference to the HTTP or HTTPS webserver that provides the foundation for
the creation of the Wbesocket server.
*/
function launch_websocket_server( myWebserver ) {
    return wsServer = new webSocketServer({
        httpServer: myWebserver
    });
}
exports.launch_websocket_server = launch_websocket_server;