/*Websocket*/
const websocket = require('websocket');

function do_start_websocket_server( myWebserver ) {
    const WebSocketServer = websocket.server;
    return wsServer = new WebSocketServer({
        httpServer: myWebserver
    });
}
exports.do_start_websocket_server = do_start_websocket_server;