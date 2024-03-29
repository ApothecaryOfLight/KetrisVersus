"use strict";
process.title = 'node-ketrisvs';

/*Error logging*/
const error_log = require('../admin-backend/error-logging.js');

/*Webserver*/
const webserver = require('./webserver.js');

/*Websocket*/
const websocket = require('./websocket.js');


/*
Sends game event to the other player.

myGames: Array reference containing all existing games being played.

inGameID: Unique identifier denoting which game the event took place in.

inMyConnection: Reference to the connection of the player where the event originated.

inMessage: String containing the event itself.
*/
function sendToEnemy( myGames, inGameID, inMyConnection, inMessage ) {
	myGames[inGameID].forEach( user => {
		if( user != inMyConnection ) {
			user.send( inMessage );
		}
	});
}


/*
Function called once that attaches the request event listener, listeneing for a
request event.

Whenever a new user connects, which takes place when a new game starts, that event
listener will fire, creating a ping Interval, to keep the connection alive even
when the game is paused, and attaches an additional event listener for that
user, listening for the message event.

That message event will always be a JSON formatted string, so we will use JSON.parse
to return an Object containing the event type and the data associated with that event.

We will also attach to each user a connection close event listener. It is important to
note that this will not fire every time a connection is closed. There are a number of
disconnections that will not cause this to fire. The documentation specifies that events
such as the user's computer being unplugged will not cause this event to fire.
*/
function attach_connection_events( myWebsocketServer ) {
  const myGames = [];

  myWebsocketServer.on('request', function(request) {
    var connection = request.accept( null, request.origin );

    setInterval( () => {
      connection.sendUTF(JSON.stringify({
        type: "game_event",
        event: "ping"
      }));
    },
    2900 );

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
        sendToEnemy( myGames, game_id, connection, out );
      } else if( json.event === "client_movement" ) {
        var out = JSON.stringify({
          type: 'game_event',
          event: 'server_movement',
          direction: json.direction
        });
        sendToEnemy( myGames, game_id, connection, out );
      } else if( json.event === "client_score" ) {
        var out = JSON.stringify({
          type: 'game_event',
          event: 'server_score',
          score: json.score
        });
        sendToEnemy( myGames, game_id, connection, out );
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
        sendToEnemy( myGames, game_id, connection, out );
      } else if( json.event === "client_rotation" ) {
        var out = JSON.stringify({
          type: 'game_event',
          event: 'server_rotation',
          rotation: json.rotation
        });
        sendToEnemy( myGames, game_id, connection, out );
      } else if( json.event === "client_pause" ) {
        var out = JSON.stringify({
          type: 'game_event',
          event: 'server_pause'
        });
        sendToEnemy( myGames, game_id, connection, out );
      } else if( json.event === "client_unpause" ) {
        var out = JSON.stringify({
          type: 'game_event',
          event: 'server_unpause'
        });
        sendToEnemy( myGames, game_id, connection, out );
      } else if( json.event === "client_freeze" ) {
        var out = JSON.stringify({
          type: 'game_event',
          event: 'server_freeze'
        });
        sendToEnemy( myGames, game_id, connection, out );
      } else if( json.event === "client_unfreeze" ) {
        var out = JSON.stringify({
          type: 'game_event',
          event: 'server_unfreeze'
        });
        sendToEnemy( myGames, game_id, connection, out );
      } else if( json.event === "client_restart" ) {
        var out = JSON.stringify({
          type:'game_event',
          event: 'server_restart'
        });
        sendToEnemy( myGames, game_id, connection, out );
      } else if( json.event === "client_end_game" ) {
        console.log( "client_end_game" );
        sendToEnemy(
          myGames,
          game_id,
          connection,
          JSON.stringify({
            type: 'game_event',
            event: 'server_end_game'
          })
        );
      } else if( json.event === "client_visible" ) {
        sendToEnemy(
          myGames,
          game_id,
          connection,
          JSON.stringify({
            type: 'game_event',
            event: 'server_visible'
          })
        );
      } else if( json.event === "client_hidden" ) {
        sendToEnemy(
          myGames,
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
      }
    });
    connection.on( 'close', function( reasonCode, description ) {
      console.log( "Close connection." );
      sendToEnemy(
        myGames,
        game_id,
        connection,
        JSON.stringify({
          type: 'game_event',
          event: 'server_end_game'
        })
      );
      sendToEnemy(
        myGames,
        game_id,
        connection,
        JSON.stringify({
          type: 'game_event',
          event: 'server_disconnect'
        })
      );
      myGames[game_id] = [];
    });
  });
}

function main() {
  const myWebserver = webserver.launch_webserver();
  const myWebsocketServer = websocket.launch_websocket_server( myWebserver );
  attach_connection_events( myWebsocketServer );
}

main();