/*Websocket*/
const websocket = require('websocket');

function do_start_websocket_server( myLogger, myWebserver ) {
    try {
        const WebSocketServer = websocket.server;
        return wsServer = new WebSocketServer({
            httpServer: myWebserver
        });
    } catch( error_obj ) {
        console.error( error_obj );
        myLogger.log_error(
            "websocket_server.js::do_start_websocket_server::catch",
            "Error initializing websocket server.",
            1,
            "server",
            error_obj
        );
    }
}
exports.do_start_websocket_server = do_start_websocket_server;