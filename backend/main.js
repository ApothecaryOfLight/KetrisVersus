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

const clients = [];

function doesUserExist( inUsername ) {
	clients.forEach( client => {
		if( client.username === inUsername ) {
			return true;
		}
	});
	return false;
}

wsServer.on('request', function(request) {
	//console.dir( request );
	var connection = request.accept( null, request.origin );
	console.log( "Connection!" );
	const new_user = {
		conn : connection,
		username : "unlogged",
		password : "unlogged",
		isLogged : false
	}
	//clients.push( new_user );
	connection.on('message', function( message ) {
		console.log( "Recieved message!" );
		const inMessage = JSON.parse( message.utf8Data );
		console.dir( inMessage );
		if( inMessage.event === "login" ) {
			console.log( "Attempting login!" );
			if( doesUserExist( inMessage.username ) == false ) {
				new_user.username = inMessage.username;
				new_user.password = inMessage.password;
				console.log( "Login approved!" );
				clients.push( new_user );
				connection.sendUTF( "login_approved" );
				//sendNewUserNotification( new_user.username );
			} else {
				connection.sendUTF( "login_rejected" );
			}
		} else if( inMessage.event === "chat_message" ) {
			clients.forEach( client => {
				client.conn.sendUTF( inMessage.text );
			});
		} else if( inMessage.event === "game_start" ) {

		} else if( inMessage.event === "game_select" ) {

		} else {
			console.log( "Unrecognized object!" );
			console.dir( inMessage );
		}

		/*console.log( message );
		clients.forEach( client =>
			client.conn.sendUTF( message.utf8Data )
		);*/
	});
	connection.on( 'close', function( reasonCode, desc ) {
		console.log( "Closed connection!" );
		clients.forEach( (client, index) => {
			if( client.conn === connection ) {
				console.log( "Loggin out user" );
				if( client.username != "unlogged" ) {
					console.log( "Logged out username: " + client.username );
					//sendLogoutUserNotification( client.username );
				}
				clients.splice( index, 1 );
			}
		});
	});
});

