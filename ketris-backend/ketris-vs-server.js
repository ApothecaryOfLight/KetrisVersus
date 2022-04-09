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

/*Error logging*/
const error_log = require('../admin-backend/error-logging.js');

if( process.argv[2] == "prod" ) {
  fs = require('fs');
  https = require('https');
  privateKey = fs.readFileSync('../privkey.pem');
  certificate = fs.readFileSync('../fullchain.pem');
  credentials = {key: privateKey, cert: certificate};
}

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
});
DB_Client.connect('ws://localhost:8989/');


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
  var connection = request.accept( null, request.origin );

  setInterval( () => {
    console.log("ping");
    connection.sendUTF(JSON.stringify({
      type: "game_event",
      event: "ping"
    }));
  },
  29000 );

  let game_id = -1;
  connection.on( 'message', function( message ) {
    var json = JSON.parse( message.utf8Data );
    if( json.event === "client_new_shape" ) {
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
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_movement',
        direction: json.direction
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_score" ) {
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_score',
        score: json.score
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_collision" ) {
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
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_rotation',
        rotation: json.rotation
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_pause" ) {
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_pause'
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_unpause" ) {
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_unpause'
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_freeze" ) {
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_freeze'
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_unfreeze" ) {
      var out = JSON.stringify({
        type: 'game_event',
        event: 'server_unfreeze'
      });
      sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_restart" ) {
      var out = JSON.stringify({
        type:'game_event',
        event: 'server_restart'
       });
       sendToEnemy( game_id, connection, out );
    } else if( json.event === "client_end_game" ) {
      sendToEnemy(
        game_id,
        connection,
        JSON.stringify({
          type: 'game_event',
          event: 'server_end_game'
        })
      );
    } else if( json.event === "client_visible" ) {
      sendToEnemy(
        game_id,
        connection,
        JSON.stringify({
          type: 'game_event',
          event: 'server_visible'
        })
      );
    } else if( json.event === "client_hidden" ) {
      sendToEnemy(
        game_id,
        connection,
        JSON.stringify({
          type: 'game_event',
          event: 'server_hidden'
        })
      );
    } else if( json.event === "client_start_ketris" ) {
      game_id = json.game_id;
      if( !myGames[json.game_id] ) {
        myGames[json.game_id] = [];
      }
      myGames[json.game_id].push( connection );
      //TODO: Send approval packet to make sure both connections are in myGames
      if( myGames[json.game_id].length == 2 ) {
        myGames[json.game_id].forEach( game => {
          game.send( JSON.stringify({
            type: 'game_event',
            event: 'server_commence_gameplay'
          }));
        });
      }
    } else if( json.event === "pong" ) {
      console.log("pong");
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
