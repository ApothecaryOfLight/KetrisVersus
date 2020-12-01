"use strict";
process.title = 'node-ketrisvs';
var myPort = 1337;
var webSocketServer = require('websocket').server;
var http = require('http');
var myClients = {};
var myButtons = [];

let myGames = [];

var fs = require('fs')
console.file_log = function( inMsg ) {
  fs.appendFile("/tmp/Ketris_VS_log.log", inMsg+"\n", (error)=> {
	if( error ) throw error;
	console.log( "Log write." );
  });
}

var server = http.createServer( function( request, response ) {  } );
server.listen( myPort, function() {
	console.log( "@:" + (new Date()) +
		" Server listening on port " + myPort );
});
var wsServer = new webSocketServer({
	httpServer: server
});

function sendToEnemy( inGameID, inMyConnection, inMessage ) {
	myGames[inGameID].forEach( user => {
		if( user != inMyConnection ) {
			user.send( inMessage );
		}
	});
}

wsServer.on('request', function(request) {
	console.log(
		(new Date()) + ' Connection from origin '
		+ request.origin + '.'
	);
	var connection = request.accept( null, request.origin ); 
	let game_id = -1;
	console.log( (new Date()) + ' Connection accepted.' );
	connection.on( 'message', function( message ) {
		var json = JSON.parse( message.utf8Data );
		console.log( "Recieved message." );
		console.dir( json );
		if( json.event === "new_shape" ) {
			console.log( "New Shape");
			console.log( json.Shape + "/" + json.Color );
			var out = JSON.stringify(
				{
					type: 'game_event',
					event: 'new_shape',
					Shape: json.Shape,
					Rotation: json.Rotation,
					Color: json.Color,
					XPos: json.XPos,
					YPos: json.YPos,
					Timestamp: json.Timestamp
				}
			);
			sendToEnemy( game_id, connection, out );
		} else if( json.event === "movement" ) {
			console.log( "Movement");
			var out = JSON.stringify(
				{
					type: 'game_event',
					event: 'movement',
					direction: json.direction
				}
			);
			sendToEnemy( game_id, connection, out );
		} else if( json.event === "score" ) {
			console.log( "Score" );
			var out = JSON.stringify(
				{
					type: 'game_event',
					event: 'score',
					score: json.score
				}
			);
			sendToEnemy( game_id, connection, out );
		} else if( json.event === "collision" ) {
			console.log( "Collision");
			var out = JSON.stringify(
				{
					type: 'game_event',
					event: 'collision',
					Shape: json.Shape,
					Rotation: json.Rotation,
					Color: json.Color,
					XPos: json.XPos,
					YPos: json.YPos,
					Timestamp: json.Timestamp
				}
			);
			sendToEnemy( game_id, connection, out );
		} else if( json.event === "rotation" ) {
			console.log( "Rotation" );
			var out = JSON.stringify( 
				{
					type: 'game_event',
					event: 'rotation',
					rotation: json.rotation
				}
			);
			sendToEnemy( game_id, connection, out );
		} else if( json.event === "pause" ) {
			console.log( "pause" );
			var out = JSON.stringify( 
				{
					type: 'game_event',
					event: 'pause'
				}
			);
			sendToEnemy( game_id, connection, out );
		} else if( json.event === "unpause" ) {
			console.log( "unpause" );
			var out = JSON.stringify( 
				{
					type: 'game_event',
					event: 'unpause'
				}
			);
			sendToEnemy( game_id, connection, out );
		} else if( json.event === "freeze" ) {
			console.log( "freeze" );
			var out = JSON.stringify( 
				{
					type: 'game_event',
					event: 'freeze'
				}
			);
			sendToEnemy( game_id, connection, out );
		} else if( json.event === "unfreeze" ) {
			console.log( "unfreeze" );
			var out = JSON.stringify( 
				{ type: 'game_event',
				event: 'unfreeze'
			} );
			sendToEnemy( game_id, connection, out );
		} else if( json.event === "restart" ) {
			console.log( "Restart" );
			var out = JSON.stringify(
				{
					type:'game_event',
					event: 'restart'
				}
			);
			sendToEnemy( game_id, connection, out );
		} else if( json.event === "end_game" ) {
			console.log( "Endgame" );
			sendToEnemy( game_id, connection,
				JSON.stringify({
					type: 'game_event',
					event: 'end_game'
				})
			);
		} else if( json.event === "start_ketris" ) {
			console.log( "Logging a start_ketris" );
			game_id = json.game_id;
			if( !myGames[json.game_id] ) {
				myGames[json.game_id] = [];
			}
			myGames[json.game_id].push( connection );
			//TODO: Send approval packet to make sure both connections are in myGames
			if( myGames[json.game_id].length == 2 ) {
				console.log( "Starting match." );
				myGames[json.game_id].forEach( game => {
					game.send( JSON.stringify({
						type: 'game_event',
						event: 'commence_gameplay'
					}));
				});
			}
		}
	});
	connection.on( 'close', function( reasonCode, description ) {
		console.log( "Close connection." );
		sendToEnemy( game_id, connection, JSON.stringify({
			type: 'game_event',
			event: 'disconnect'
		}));
	});
});
