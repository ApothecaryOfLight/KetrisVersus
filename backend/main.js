const WebSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer( function(request, response) {
	console.log( "Recieved request." );
	response.writeHead(404);
	response.end();
});
server.listen( 3000, function() {
	console.log( "Listening on port 3000" );
});

wsServer = new WebSocketServer({
	httpServer: server
});

wsServer.on('request', function(request) {
	//console.dir( request );
	var connection = request.accept( null, request.origin );
	console.log( "Connection!" );
	connection.on('message', function( message ) {
		console.log( "Recieved message!" );
		console.log( message );
	});
	connection.on( 'close', function( reasonCode, desc ) {
		console.log( "Closed connection!" );
	});
});

