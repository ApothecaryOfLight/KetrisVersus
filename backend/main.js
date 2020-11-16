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
const avail_games = [];

function doesUserExist( inUsername ) {
	clients.forEach( client => {
		if( client.username === inUsername ) {
			return true;
		}
	});
	return false;
}

function sendNewUserNotification( inUsername, connection ) {
	console.log( "Sending new user notification to all logged-in clients." );
	const newUser = {
		event: "new_user",
		username: inUsername
	};
	const out = JSON.stringify( newUser );
	console.dir( newUser );
	clients.forEach( client => {
		if( connection != client.conn && client.username != "placeholder" ) {
			client.conn.sendUTF( out );
		}
	});
}

function sendUserList(conn) {
	console.log( "Sending UserList" );
	const userList = [];
	clients.forEach( client=> {
		userList.push({
			username: client.username
		});
	});
	console.dir( userList );
	const out = {
		event : "user_list",
		user_list : userList
	}
	conn.sendUTF( JSON.stringify( out ) );
}

function sendGameList(conn) {
	const avail_gamesList = [];
	avail_games.forEach( game=> {
		avail_gamesList.push({
			game_name: game.game_name
		});
	});
	const out = {
		event: "game_list",
		game_list : avail_gamesList
	}
	conn.sendUTF( JSON.stringify( out ) );
}

function sendLists(conn) {
	sendUserList(conn);
	sendGameList(conn);
}

function sendLogoutUserNotification( inUsername ) {
	const oldUser = {
		event: "remove_user",
		username: inUsername
	};
	const out = JSON.stringify( oldUser );
	clients.forEach( client => {
		client.conn.sendUTF( out );
	});
}

function remove_game(connection,in_game_name) {
  clients.forEach( (client) => {
    if( client.conn != connection ) {
      client.conn.sendUTF( JSON.stringify({
        game_name: in_game_name,
        event: "remove_game"
      }));
    }
  });
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
				sendLists(connection);
				sendNewUserNotification( new_user.username, connection );
			} else {
				connection.sendUTF( "login_rejected" );
			}
		} else if( inMessage.event === "chat_message" ) {
			const chat_message = {
				username : "placeholder",
				userdata : "placeholder",
				text : inMessage.text,
				event: "chat_message"
			}
			const chat_message_string = JSON.stringify( chat_message );
			clients.forEach( client => {
				client.conn.sendUTF( chat_message_string );
			});
		} else if( inMessage.event === "new_game" ) {
			console.log( "New game" );
			const new_game = {
				event : "new_game",
				game_name : new_user.username
			}
			avail_games.push( new_game );
			const new_game_text = JSON.stringify( new_game );
			clients.forEach( client => {
				if( client.username != new_user.username ) {
					client.conn.sendUTF( new_game_text );
				}
			});
		} else if( inMessage.event === "game_select" ) {

		} else {
			console.log( "Unrecognized object!" );
			console.dir( inMessage );
		}
	});
	connection.on( 'close', function( reasonCode, desc ) {
		console.log( "Closed connection!" );
		clients.forEach( (client, index) => {
			if( client.conn === connection ) {
				console.log( "Loggin out user" );
				if( client.username != "unlogged" ) {
					console.log( "Logged out username: " + client.username );
					sendLogoutUserNotification( client.username );
				}
				avail_games.forEach( (game,index) => {
					if( game.game_name === client.username ) {
						avail_games.splice( index, 1 );
						remove_game(connection,game.game_name);
					}
				});
				clients.splice( index, 1 );
			}
		});
	});
});

