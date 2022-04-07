/*
This is sent to new users, to give them a full list of listed games.
*/
function send_GameList(games, conn) {
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
    conn.sendUTF( JSON.stringify( out ) );
  }
  exports.send_GameList = send_GameList;
  
  /*
  Deletes game serverside.
  */
  function remove_game( users, games, in_game_id, myUIDGen ) {
    console.log( "remove_game " + in_game_id );
  
    //If game is listed, send delisting to all connected users.
    if( games[ in_game_id ].is_listed == true ) {
      send_delist_game( users, in_game_id );
    }
  
    //Delete game.
    games[ in_game_id ] = {};
    myUIDGen.retireUID( "games", in_game_id );
  }
  exports.remove_game = remove_game;
  
  /*
  This is sent to all connected users to notify them that a game is no longer available.
  */
  function send_delist_game( users, in_game_id, send_MessageToAll ) {
    send_MessageToAll(
      users,
      {
        type: "chat_event",
        event: "server_delist_game",
        game_id: in_game_id
      }
    );
  }
  exports.send_delist_game = send_delist_game;
  
  
  /*
  This is sent to all connected users to notify them that a game is available.
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
  
  function send_launch_game( users, games, in_game_id, send_MessageToUser ) {
    const message = {
      type: "chat_event",
      event: "server_enter_game",
      game_id: in_game_id
    };
    console.log( "send_launch_game" );
    console.log( games[in_game_id].game_name );
    send_MessageToUser( users, message, games[in_game_id].posting_user_id );
    send_MessageToUser( users, message, games[in_game_id].accepting_user_id );
  }
  exports.send_launch_game = send_launch_game;