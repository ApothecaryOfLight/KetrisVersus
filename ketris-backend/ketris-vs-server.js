"use strict";
process.title = 'node-ketrisvs';
var myPort = 3003;
var webSocketServer = require('websocket').server;

const webSocketClient = require('websocket').client;
const DB_Client = new webSocketClient();

var http = require('http');

/*HTTPS*/
var fs;
var https;
var privateKey;
var certificate;
var credentials;

if( process.argv[2] == "prod" ) {
  fs = require('fs');
  https = require('https');
  privateKey = fs.readFileSync('../privkey.pem');
  certificate = fs.readFileSync('../fullchain.pem');
  credentials = {key: privateKey, cert: certificate};
}
//var server = https.createServer( credentials, app );

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


let db_backend;
DB_Client.on('connect', function(connection) {
  console.log( "Connected to mySQL backend!" );
  db_backend = connection;
  //db_backend.sendUTF( "testing" );
});
DB_Client.connect('ws://localhost:8989/');



//var server = http.createServer( function( request, response ) {  } );
var server;
if( process.argv[2] == "prod" ) {
  server = https.createServer( credentials, function( req, res ) { } );
} else {
  server = http.createServer( (req,res) => {} );
}
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
    if( json.event === "client_new_shape" ) {
      console.log( "New Shape");
      console.log( json.Shape + "/" + json.Color );
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_new_shape',
        Shape: json.Shape,
        Rotation: json.Rotation,
        Color: json.Color,
        XPos: json.XPos,
        YPos: json.YPos,
        Timestamp: json.Timestamp
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_movement" ) {
      console.log( "Movement");
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_movement',
        direction: json.direction
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_score" ) {
      console.log( "Score" );
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_score',
        score: json.score
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_collision" ) {
      console.log( "Collision");
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_collision',
        Shape: json.Shape,
        Rotation: json.Rotation,
        Color: json.Color,
        XPos: json.XPos,
        YPos: json.YPos,
        Timestamp: json.Timestamp
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_rotation" ) {
      console.log( "Rotation" );
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_rotation',
        rotation: json.rotation
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_pause" ) {
      console.log( "pause" );
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_pause'
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_unpause" ) {
      console.log( "unpause" );
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_unpause'
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_freeze" ) {
      console.log( "freeze" );
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_freeze'
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_unfreeze" ) {
      console.log( "unfreeze" );
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_unfreeze'
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_restart" ) {
      console.log( "Restart" );
      var out = JSON.stringify({
        type:'game_event',
        event: 'server_restart'
       });
       sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_end_game" ) {
      console.log( "Endgame" );
      sendToEnemy(
        game_id,
        connection,
        JSON.stringify({
          type: 'game_event',
          event: 'server_end_game'
        })
      );
    } else if( json.event === "client_visible" ) {
      console.log( "visible" );
      sendToEnemy(
        game_id,
        connection,
        JSON.stringify({
          type: 'game_event',
          event: 'server_visible'
        })
      );
    } else if( json.event === "client_hidden" ) {
      console.log( "hidden" );
      sendToEnemy(
        game_id,
        connection,
        JSON.stringify({
          type: 'game_event',
          event: 'server_hidden'
        })
      );
    } else if( json.event === "client_start_ketris" ) {
      console.log( "Logging a start_ketris" );
      game_id = json.game_id;
      if( !myGames[json.game_id] ) {
        myGames[json.game_id] = [];
      }
      myGames[json.game_id].push( connection );
      //TODO: Send approval packet to make sure both connections are in myGames
      console.dir( myGames[json.game_id].length );
      if( myGames[json.game_id].length == 2 ) {
        console.log( "Starting match." );
        myGames[json.game_id].forEach( game => {
          game.send( JSON.stringify({
            type: 'game_event',
            event: 'server_commence_gameplay'
          }));
        });
      }
    }
  });
  connection.on( 'close', function( reasonCode, description ) {
    console.log( "Close connection." );
    sendToEnemy( game_id, connection, JSON.stringify({
      type: 'game_event',
      event: 'server_disconnect'
    }));
    myGames[game_id] = [];
  });
});
