/*Webserver*/
const webserver = require('./webserver.js');

/*Websocket*/
const websocket = require('./websocket_server.js');

/*MySQL*/
const mysql = require('./mysql.js');

/*Unique ID Generator*/
const unique_id_generator = require('./unique_id_generator');

/*File system*/
const fs = require('fs');

/*Error logging*/
const error_log = require('../admin-backend/error-logging.js');

/*Users*/
const myUsers = require('./users.js');

/*Chat*/
const myChat = require('./chat.js')

/*Game Listings*/
const myGames = require('./games.js')

function log_dev_message ( mySqlPool, inAuthor, inMessage, inTimestamp ) {
  console.log( "log_dev_message" );
  mySqlPool.query(
    'INSERT INTO ketris_messages ( author_name, message_body, timestamp ) VALUES ' +
    '(\"' + inAuthor + '\", \"' + inMessage + '\", \'' + inTimestamp + '\');',
    function( error, results, fields ) {
      if( error ) { console.log( error ); return; }
      console.log( "Logged dev message!" )
      console.log( inAuthor + "@" + inTimestamp + ": " + inMessage );
    }
  );
}

function do_attach_connection_events( myWebsocket, mySqlPool ) {
  const myUIDGen = new unique_id_generator.unique_id_generator;
  const users = [];
  const games = [];

  myWebsocket.on('request', function(request) {
    const myConnection = request.accept( null, request.origin );
    console.log( "New connection!" );

    const new_user = {
      connection : myConnection,
      username : "unlogged",
      password : "unlogged",
      isLogged : false,
      user_id : -1
    }

    myConnection.on('message', function( message ) {
      console.log( "Recieved message!" );
      const inMessage = JSON.parse( message.utf8Data );
      console.dir( inMessage );
      if( inMessage.event === "client_login" ) {
        console.log( "Attempting login!" );
        myUsers.attempt_login(
          error_log,
          new_user,
          inMessage,
          users,
          games,
          mySqlPool,
          inMessage.username,
          inMessage.password,
          myConnection,
          request,
          myUIDGen,
          myGames.send_GameList
        );
      } else if( inMessage.event === "client_account_creation" ) {
        console.log( "Attempting to create account!" );
        myUsers.attempt_create_user(
          error_log,
          mySqlPool,
          inMessage.username,
          inMessage.password,
          myConnection,
          request
        );
      } else if( inMessage.event === "client_chat_message" ) {
        const chat_message = {
          type: "chat_event",
          username : new_user.username,
          userdata : "placeholder",
          text : inMessage.text,
          event: "server_chat_message"
        }
        const chat_message_string = JSON.stringify( chat_message );
        users.forEach( user => {
          if( Object.keys( user ).length != 0 ) {
            user.connection.sendUTF( chat_message_string );
          }
        });
      } else if( inMessage.event === "client_new_game" ) {
        console.log( "New game" );

        //Add game to available games.
        const new_game = {
          game_name: new_user.username,
          game_id: myUIDGen.generate_uid( "games" ),
          is_listed: true,
          posting_user_id: new_user.user_id
        }
        games[ new_game.game_id ] = new_game;

        //Add game_id to current user.
        users[ new_user.user_id ].game_id = new_game.game_id;
        console.log( "Setting user_id " + new_user.user_id + " to has game true." );
        users[ new_user.user_id ].has_game = true;

        //Send list event to connected users.
        myGames.send_list_game(
          users,
          new_user.user_id,
          users[new_user.user_id].username,
          new_game.game_id,
          users[new_user.user_id].username,
          myChat.send_MessageToAllExcept
        );
      } else if( inMessage.event === "client_enter_game" ) {

        //If accepting user has a game posted, delist it.
        if( users[ new_user.user_id ].has_game == true ) {
          myGames.send_delist_game( users, users[new_user.user_id].game_id, myChat.send_MessageToAll );
          myGames.remove_game( users, games, users[new_user.user_id].game_id, myUIDGen );
        }

        //Mark game as no longer listed.
        games[ inMessage.game_id ].is_listed = false;

        //Add second user to game
        games[ inMessage.game_id ].accepting_user_id = new_user.user_id;

        //Add game_id to both users.
        users[ games[inMessage.game_id].accepting_user_id ].game_id = inMessage.game_id;

        //Update user profile to reflect that game is delisted.
        users[ games[inMessage.game_id].posting_user_id ].has_game = false;

        //Send notice to all users that game has been delisted.
        myGames.send_delist_game( users, inMessage.game_id, myChat.send_MessageToAll );

        //Send message to both participants that Ketris should be launched.
        myGames.send_launch_game( users, games, inMessage.game_id, myChat.send_MessageToUser );
      } else if( inMessage.event === "client_completed_game" ) {
        console.log( "Game completed." );
        myGames.remove_game( users, games, inMessage.game_id, myUIDGen );
      } else if( inMessage.event == "client_dev_message" ) {
        console.log( "Recieved dev message!" );
        log_dev_message( mySqlPool, inMessage.author, inMessage.message, "1999-01-01 12:12:12" );
      } else if( inMessage.event == "keep_alive" ) {
        const kept_alive = {
          type: "chat_event",
          event: "kept_alive"
        }
        myConnection.sendUTF( JSON.stringify(kept_alive) );
      } else {
        console.log( "Unrecognized object!" );
        console.dir( inMessage );
      }
    });
    myConnection.on( 'close', function( reasonCode, desc ) {
      console.log( "Closed connection!" );

      //If user hasn't logged in yet simply return.
      if( new_user.user_id == -1 ) {
        return;
      }

      //Send notice to all users that this user has disconencted.
      if( users[ new_user.user_id ].username != "unlogged" ) {
        console.log( "Logging out username: " + users[ new_user.user_id ].username );
        myUsers.send_LogoutUserNotification( users, users[ new_user.user_id ].username );

        //Delete game.
        if( users[ new_user.user_id ].has_game == true ) {
          console.log( "Removing game." );
          myGames.remove_game( users, games, new_user.game_id, myUIDGen );
        }

        //Retire user ID.
        myUIDGen.retireUID( "users", new_user.user_id );
      }

      //Delete user.
      users[new_user.user_id] = {};
    });
  });
}

function main() {
  const mySqlPool = mysql.do_connect_to_sql_server();
  const myWebserver = webserver.do_start_webserver();
  myWebserver.listen( 3002 );
  const myWebsocketServer = websocket.do_start_websocket_server( myWebserver );
  do_attach_connection_events( myWebsocketServer, mySqlPool );
}

main();