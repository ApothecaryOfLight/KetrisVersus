/*Webserver*/
const webserver = require('./webserver.js');

/*Websocket*/
const websocket = require('./websocket_server.js');

/*MySQL*/
const mysql = require('./mysql.js');

/*Unique ID Generator*/
const unique_id_generator = require('./unique_id_generator');

/*Error logging*/
const error_log = require('../admin-backend/error-logging.js');

/*Users*/
const myUsers = require('./users.js');

/*Chat*/
const myChat = require('./chat.js')

/*Game Listings*/
const myGames = require('./games.js')

function log_dev_message ( mySqlPool, inAuthor, inMessage, inTimestamp ) {
  mySqlPool.query(
    'INSERT INTO ketris_messages ( author_name, message_body, timestamp ) VALUES ' +
    '(\"' + inAuthor + '\", \"' + inMessage + '\", \'' + inTimestamp + '\');',
    function( error, results, fields ) {
      if( error ) { console.error( error ); return; }
    }
  );
}


/*
This function attaches all connection event listeners to a given Websocket connection.

This function creates an event listener for the server's Websocket that will listen
for a request on the Websocket. When that request takes place, it attaches the message
event listener that we will use to process the input of the clients.

Each client will have their own request listener, but they will all share this
function's scope outside of the anonymous function that handles the request. This
shared scope includes the myUIDGen invokation, as well as the users and games Arrays.

myWebsocket: The Websocket connection of this server.

mySqlPool: A reference to the MySQL object that is used to query the MySQL database.
*/
function do_attach_connection_events( myWebsocket, mySqlPool ) {
  const myUIDGen = new unique_id_generator.unique_id_generator;
  const users = [];
  const games = [];

  myWebsocket.on('request', function(request) {
    const myConnection = request.accept( null, request.origin );

    const new_user = {
      connection : myConnection,
      username : "unlogged",
      password : "unlogged",
      isLogged : false,
      user_id : -1,
      game_id : -1,
      has_game : false
    }

    const myWebsocketConnection = {
      myRequest: request,
      myConnection: myConnection,
      ip: request.socket.remoteAddress,
      ping: setInterval( () => {
        myConnection.sendUTF(JSON.stringify({
          type: "server_event",
          event: "ping"
        }));
      },
      2900 )
    };

    myConnection.on('message', function( message ) {
      const inMessage = JSON.parse( message.utf8Data );
      if( inMessage.event === "client_login" ) {
        myUsers.attempt_login(
          error_log,
          mySqlPool,
          new_user,
          inMessage.username,
          inMessage.password,
          users,
          games,
          myWebsocketConnection,
          myUIDGen,
          myGames.send_GameList
        );
      } else if( inMessage.event === "client_account_creation" ) {
        myUsers.attempt_create_user(
          error_log,
          mySqlPool,
          new_user,
          inMessage.username,
          inMessage.password,
          users,
          games,
          myWebsocketConnection,
          myUIDGen,
          myGames.send_GameList
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
        //Ensure that this user doesn't already have a game posted.
        if( users[ new_user.user_id].has_game ) {
          return;
        }

        //Add game to available games.
        const new_game = {
          game_name: new_user.username,
          game_id: myUIDGen.generate_uid( "games" ),
          posting_user_id: new_user.user_id
        }
        games[ new_game.game_id ] = new_game;

        //Add game_id to current user.
        users[ new_user.user_id ].game_id = new_game.game_id;
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
        console.log( "Delisting game." );
        //Delist the game serverside and with all the clients.
        const posting_user_id = games[inMessage.game_id].posting_user_id;
        myGames.delist_game(
          error_log,
          myWebsocketConnection,
          users,
          games,
          inMessage.game_id,
          posting_user_id,
          myUIDGen,
          myChat.send_MessageToAll
        );

        //Launch the game.
        myGames.launch_game(
          error_log,
          myWebsocketConnection,
          users,
          games,
          posting_user_id,
          new_user.user_id,
          inMessage.game_id,
          myChat.send_MessageToUser
        );
      } else if( inMessage.event === "client_completed_game" ) {
      } else if( inMessage.event == "client_dev_message" ) {
        log_dev_message( mySqlPool, inMessage.author, inMessage.message, "1999-01-01 12:12:12" );
      } else if( inMessage.event == "pong" ) {
      } else {
        console.log( "Unrecognized object!" );
        console.dir( inMessage );
      }
    });
    myConnection.on( 'close', function( reasonCode, desc ) {
      console.log("connection close.");
      error_log.log_event(
        "main.js::do_attach_connection_events()",
        "Websocket connection closed.",
        myWebsocketConnection.ip,
        {
          reasonCode: reasonCode,
          desc: desc
        }
      );

      //If user hasn't logged in yet simply return.
      if( new_user.user_id == -1 ) {
        return;
      }

      //Send notice to all users that this user has disconencted.
      if( users[ new_user.user_id ].username != "unlogged" ) {
        myUsers.send_LogoutUserNotification(
          users,
          users[ new_user.user_id ].username
        );

        //Delete game.
        if( users[ new_user.user_id ].has_game == true ) {
          console.log( "Desliting game " + users[new_user.user_id].game_id );
          myGames.delist_game(
            error_log,
            myWebsocketConnection,
            users,
            games,
            users[ new_user.user_id ].game_id,
            users[ new_user.user_id ].user_id,
            myUIDGen,
            myChat.send_MessageToAll
          );
        }

        //Retire user ID.
        myUIDGen.retireUID( "users", new_user.user_id );
      }

      //Delete user.
      users[new_user.user_id] = {};
    });
  });
}


/*
Main function. This serves as the entry-point for the program, launching the chat server and everything it needs.
*/
function main() {
  const mySqlPool = mysql.do_connect_to_sql_server();
  const myWebserver = webserver.do_start_webserver( error_log );
  myWebserver.listen( 3002 );
  const myWebsocketServer = websocket.do_start_websocket_server( error_log, myWebserver );
  do_attach_connection_events( myWebsocketServer, mySqlPool );
}

main();