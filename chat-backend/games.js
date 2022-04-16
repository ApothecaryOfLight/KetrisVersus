/*
This is sent to new users, to give them a full list of posted games.
*/
function send_GameList( myLogger, games, myWebsocketConnection ) {
    try {
        const avail_gamesList = [];
        games.forEach( game=> {
            if( Object.keys(game).length != 0 && game.is_listed == true ) {
                avail_gamesList.push({
                    game_name: game.game_name,
                    game_id: game.game_id
                });
            }
        });
        const out = {
            type: "chat_event",
            event: "server_game_list",
            game_list : avail_gamesList
        }
        myWebsocketConnection.myConnection.sendUTF( JSON.stringify( out ) );
    } catch( error_obj ) {
        myLogger.log_error(
            "games.js::send_GameList()::catch",
            "Failed to send game list to a specified connection.",
            0,
            myWebsocketConnection.ip,
            error_obj
        )
    }
}
exports.send_GameList = send_GameList;


/*
Removes the game from being listed as posted on the client-side,
and then deletes the game on the chat server.
This takes place whether the game has been deleted, or whether
the game has been accepted by another player.
*/
function remove_game( myLogger, myWebsocketConnection, users, games, in_game_id, myUIDGen ) {
    try {
        //If game is listed, send delisting to all connected users.
        if( games[ in_game_id ].is_listed == true ) {
            send_delist_game( users, in_game_id );
        }

        //Delete game server-side.
    } catch( error_obj ) {
        myLogger.log_error(
            "games.js::remove_game()::catch",
            "Failed to delete game.",
            0,
            myWebsocketConnection.ip,
            error_obj
        );
    }
}
exports.remove_game = remove_game;


/*
This is sent to all connected users to notify them that a game is no longer posted,
whether that means the user who created it has logged out, or whether the game
has been accepted by another player.
*/
function delist_game( myLogger, myWebsocketConnection, users, games, in_game_id, in_posting_user_id, myUIDGen, send_MessageToAll ) {
    try {
        //Mark game as no longer listed.
        games[ in_game_id ].is_listed = false;

        //Update posting user server-side info to reflect that game is delisted.
        users[ in_posting_user_id ].has_game = false;
        
        //Delete game server-side and retire its ID.
        games[ in_game_id ] = {};
        myUIDGen.retireUID( "games", in_game_id );

        //Send message to all connected users that the game is delisted.
        send_MessageToAll(
            users,
            {
                type: "chat_event",
                event: "server_delist_game",
                game_id: in_game_id
            }
        );
    } catch( error_obj ) {
        console.dir( error_obj );
        myLogger.log_error(
            "games.js::delist_game()::catch",
            "Error delisting game.",
            0,
            myWebsocketConnection.ip,
            error_obj
        )
    }
}
exports.delist_game = delist_game;


/*
This function sends a message to both the user who originall posted the game,
who is specified by in_posting_user_id, as well as the user who accepted the game,
which is specified in in_accepting_user_id.

myLogger: The error/event logging object.

myWebsocketConnection: A reference to the websocket connection of the accepting user.

users: An Array containing all connected users.

games: An Array containing all posted games.

in_posting_user_id: The unique identifier of the user who originally created the game.

in_accepting_user_id: The unique identifier of the user who accepted the game.

in_game_id: The unique identifier of the game that both players want to enter.

send_MessageToUser: A reference to the function that will send the server_enter_game
event to both users.
*/
function launch_game( myLogger, myWebsocketConnection, users, games, in_posting_user_id, in_accepting_user_id, in_game_id, send_MessageToUser ) {
    try {
        //Add game_id to accepting user.
        users[ in_accepting_user_id ].game_id = in_game_id;

        //Send message to both users to launch the game.
        const message = {
            type: "chat_event",
            event: "server_enter_game",
            game_id: in_game_id
        };
        send_MessageToUser( users, message, in_posting_user_id );
        send_MessageToUser( users, message, in_accepting_user_id );
    } catch( error_obj ) {
        myLogger.log_error(
            "games.js::launch_game()::catch",
            "Error while launching game.",
            0,
            myWebsocketConnection.ip,
            error_obj
        )
    }
}
exports.launch_game = launch_game;
  
  
/*
This is sent to all connected users to notify them that a game has been posted.
*/
function send_list_game( users, in_starting_user_id, in_starting_username, in_game_id, in_game_name, send_MessageToAllExcept ) {
    send_MessageToAllExcept(
        users,
        {
            type: "chat_event",
            event: "server_list_game",
            game_id: in_game_id,
            starting_user: in_starting_username,
            game_name: in_starting_username //placeholder
        },
        in_starting_user_id
    );
}
exports.send_list_game = send_list_game;