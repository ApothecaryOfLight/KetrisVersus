"use strict";
process.title = 'node-ketrisvs';
var myPort = 1337;
var webSocketServer = require('websocket').server;
var http = require('http');
var myClients = {};
var myButtons = [];


var fs = require('fs')
console.file_log = function( inMsg ) {
  fs.appendFile("/tmp/Ketris_VS_log.log", inMsg+"\n", (error)=> {
	if( error ) throw error;
	console.log( "Log write." );
  });
}


function htmlEntities( str ) {
	return String( str )
		.replace(/&/g, '&amp;').replace(/</g, '&lt;').
		replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
var server = http.createServer( function( request, response ) {  } );
server.listen( myPort, function() {
	console.log( "@:" + (new Date()) +
		" Server listening on port " + myPort );
});
var wsServer = new webSocketServer({
	httpServer: server
});
wsServer.on('request', function(request) {
	console.log(
		(new Date()) + ' Connection from origin '
		+ request.origin + '.'
	);
	var connection = request.accept( null, request.origin ); 
	var userName = false;
	console.log( userName );
	console.log( (new Date()) + ' Connection accepted.' );
	connection.on( 'message', function( message ) {
		var json = JSON.parse( message.utf8Data );

		if( userName === false ) {
			if( json.event === "login_request" ) {
				console.log( "Login request" );
				if( myClients[json.username] ) {
					console.log( "Username taken." );
					var myNo = JSON.stringify(
						{ type:'login_rejected' }
					);
					connection.sendUTF( myNo );
					return;
				} else {
					userName = json.username;
					console.log(
						"New user with name: " +
						userName
					);
					console.file_log( "New user with name: " + userName );					
					var myOngoingGames = JSON.stringify(
						myButtons );
					console.log(
						"ONGOING GAMES: " +
						myOngoingGames
					);
					var myOut = JSON.stringify(
						{
							type:'login_approved',
							event: "login_approved",
							author: userName,
							ongoing: myOngoingGames
						}
					);
					myClients[userName] =
						myClients[userName] || {};
					myClients[userName].myConnection =
						connection;
					myClients[userName].myConnection.
						sendUTF( myOut );

					var myOutB = JSON.stringify(
						{
							type: 'login_announcement',
							event: 'login_announcement',
							author: userName
						}
					);
					for( var myUserKey in myClients ) {
						if( myUserKey != userName ) {
							myClients[myUserKey].
								myConnection.
								sendUTF( myOutB );
						}
					}
				}
			}
		}
		console.log(
			"Recieved message from " + userName +
			" with event of " + json.event
		);
		console.dir( json );
		if( json.event === "new_shape" ) {
			console.log( "New Shape");
			console.log( json.Shape + "/" + json.Color );
			var out = JSON.stringify(
				{
					type: 'event',
					event: 'new_shape',
					author: userName,
					Shape: json.Shape,
					Rotation: json.Rotation,
					Color: json.Color,
					XPos: json.XPos,
					YPos: json.YPos,
					Timestamp: json.Timestamp
				}
			);
			myClients[ myClients[userName].myEnemy ].
				myConnection.send( out );
		} else if( json.event === "movement" ) {
			console.log( "Movement");
			var out = JSON.stringify(
				{
					type: 'event',
					event: 'movement',
					direction: json.direction
				}
			);
			myClients[ myClients[userName].myEnemy ].
				myConnection.send( out );
		} else if( json.event === "score" ) {
			console.log( "Score" );
			var out = JSON.stringify(
				{
					type: 'event',
					event: 'score',
					score: json.score
				}
			);
			myClients[ myClients[userName].myEnemy ].
				myConnection.send( out );
		} else if( json.event === "collision" ) {
			console.log( "Collision");
			var out = JSON.stringify(
				{
					type: 'event',
					event: 'collision',
					author: userName,
					Shape: json.Shape,
					Rotation: json.Rotation,
					Color: json.Color,
					XPos: json.XPos,
					YPos: json.YPos,
					Timestamp: json.Timestamp
				}
			);
			myClients[ myClients[userName].myEnemy ].
				myConnection.send( out );
		} else if( json.event === "rotation" ) {
			console.log( "Rotation" );
			var out = JSON.stringify( 
				{
					type: 'event',
					event: 'rotation',
					rotation: json.rotation
				}
			);
			myClients[ myClients[userName].myEnemy ].
				myConnection.send( out );
		} else if( json.event === "pause" ) {
			console.log( "pause" );
			var out = JSON.stringify( 
				{
					type: 'event',
					event: 'pause'
				}
			);
			myClients[ myClients[userName].myEnemy ].
				myConnection.send( out );

		} else if( json.event === "unpause" ) {
			console.log( "unpause" );
			var out = JSON.stringify( 
				{
					type: 'event',
					event: 'unpause'
				}
			);
			myClients[ myClients[userName].myEnemy ].
				myConnection.send( out );

		} else if( json.event === "freeze" ) {
			console.log( "freeze" );
			var out = JSON.stringify( 
				{
					type: 'event',
					event: 'freeze'
				}
			);
			myClients[ myClients[userName].myEnemy ].
				myConnection.send( out );

		} else if( json.event === "unfreeze" ) {
			console.log( "unfreeze" );
			var out = JSON.stringify( 
				{ type: 'event',
				event: 'unfreeze'
			} );
			myClients[ myClients[userName].myEnemy ].
				myConnection.send( out );

		} else if( json.event === "chat" ) {
			console.log( "Chat" );
			console.dir( json );
			console.log( json.text );
			var inChar = json.text;
			var json = JSON.stringify(
				{
					type:'chat',
					text: inChar,
					author: userName
				}
			);
			console.log( json.text );
			console.dir( json.text );
			console.file_log( userName + ": " + inChar );
			for( var myUserKey in myClients ) {
				myClients[myUserKey].
					myConnection.sendUTF( json );
			}
		} else if( json.event === "new_game" ) {
			console.log( "New Game" );
			myButtons.push( userName );
			var json = JSON.stringify(
				{
					type:'event',
					event: "new_game",
					author: userName
				}
			);
			for( var myUserKey in myClients ) {
				if( userName != myUserKey ) {
					myClients[myUserKey].myConnection.
						sendUTF( json );
				}
			}
		} else if( json.event === "restart" ) {
			console.log( "Restart" );
			var restart = JSON.stringify(
				{
					type:'event',
					event: "restart"
				}
			);
			myClients[ myClients[userName].myEnemy ].
				myConnection.send( restart );
		} else if( json.event === "join_game" ) {
			console.log(
				"Join game"
			);
			console.log(
				"Starting game between " + userName +
				" VS " + json.target
			);
			var packet_start_game = JSON.stringify(
				{ type:'event',
				event: 'start_game',
				author: userName,
				participant: json.target }
			);
			console.log( "Start game happening." );
			for( var myUserKey in myClients ) {
				if( myUserKey == userName ) {
					console.log(
						"Sending start_game to client 1"
					);
					myClients[myUserKey].myEnemy = json.target;
					myClients[myUserKey].myConnection.
						sendUTF( packet_start_game );
				} else if( myUserKey == json.target ) {
					console.log(
						"Sending start_game to client 2"
					);
					myClients[myUserKey].myEnemy = userName;
					myClients[myUserKey].myConnection.
						sendUTF( packet_start_game );
				} else {
					var remove_game = JSON.stringify(
						{
							type:'event',
							event: "remove_game",
							participantA: userName,
							participantB: json.target
						}
					);
					myClients[myUserKey].myConnection.
						sendUTF( remove_game );
				}
			}
		} else if( json.event === "end_game" ) {
			var end_game = JSON.stringify(
				{
					type: 'event',
					event: 'end_game'
				}
			);
			myClients[ myClients[userName].myEnemy ].
				myConnection.send( end_game );
		}
	});
	connection.on('close', function(connection) {
		if (userName !== false ) {
			console.log((new Date()) + " Peer disconnected." );

			if(myClients[ myClients[userName].myEnemy ] != undefined ) {
				console.log(
					"Logging out : " +
					myClients[userName].myEnemy
				);
				var end_game = JSON.stringify(
					{
						type: 'end_game_interface',
						event: 'dc'
					}
				);
				myClients[ myClients[userName].myEnemy ].
					myConnection.send( end_game );
			}
			delete myClients[userName];
			myButtons.splice( myButtons.indexOf( userName ), 1 );
			var remove_user = JSON.stringify(
				{
					type:'logout',
					event: 'logout',
					logoutee: userName
				}
			);
			for( var myUserKey in myClients ) {
				myClients[myUserKey].
					myConnection.sendUTF( remove_user );
			}
		}
	});
});
