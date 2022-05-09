'use strict';

const PostedGames = [];

function join_game_ws( inGameID, inGameName, inWebsocket ) {
  inWebsocket.send(JSON.stringify({
    event: "client_enter_game",
    game_id: inGameID,
    game_name: inGameName
  }));
}

function doComposeAvailGame( inStartingUser, inTimestamp, inGameColor, inGameIcon, inGameID, inWebsocket ) {
  const avail_game_wrapper = document.createElement("div");
  avail_game_wrapper.className = "avail_game_wrapper_class";

  const avail_game = document.createElement("div");
  avail_game.className = "avail_game_class";
  avail_game_wrapper.appendChild( avail_game );

  //Compose left side.
  const avail_game_left = document.createElement("div");
  avail_game_left.className = "avail_game_left_class";
  avail_game.appendChild( avail_game_left );

  const avail_game_icon = document.createElement("div");
  avail_game_icon.className = "avail_game_icon_class";
  avail_game_icon.style.backgroundColor = inGameColor;
  avail_game_icon.innerText = inGameIcon;
  avail_game_left.appendChild( avail_game_icon );

  const avail_game_username = document.createElement("div");
  avail_game_username.className = "avail_game_username_class";
  avail_game_username.innerText = inStartingUser;
  avail_game_left.appendChild( avail_game_username );

  const avail_game_timestamp = document.createElement("div");
  avail_game_timestamp.className = "avail_game_timestamp";
  avail_game_timestamp.innerText = inTimestamp;
  avail_game_left.appendChild( avail_game_timestamp );

  //Compose right side
  const avail_game_right = document.createElement("div");
  avail_game_right.className = "avail_game_right_class";
  avail_game.appendChild( avail_game_right );

  const avail_game_join_button = document.createElement("button");
  avail_game_join_button.className = "avail_game_join_game_button_class button_class";
  avail_game_join_button.innerText = "Join Game";
  avail_game_join_button.onclick =
    join_game_ws.bind(
      null,
      inGameID,
      inStartingUser,
      inWebsocket
    );
  avail_game_right.appendChild( avail_game_join_button );

  return avail_game_wrapper;
}

function doAddAllListedGames( event ) {
  const inMessage = JSON.parse( event.data );
  if( inMessage.event == "server_game_list" ) {
    //Iterate through each posted game.
    inMessage.game_list.map( (game) => {
      //1) Create the element fragment.
      const avail_games_area = document.getElementById("column_avail_games_area");
      const avail_game = avail_games_area.appendChild( doComposeAvailGame(
        game.game_name,
        "Time is on our side",
        getHexColor( game.game_name.charAt(0).toUpperCase() ),
        game.game_name.charAt(0).toUpperCase(),
        game.game_id,
        this 
      ) );

      //2) Add the game to the list of stored games.
      PostedGames.push({
        game_name: game.game_name,
        game_icon: game.game_name.charAt(0).toUpperCase(),
        game_color: getHexColor( game.game_name.charAt(0).toUpperCase() ),
        game_id: game.game_id,
        UID: game.game_id,
        DOM_reference: avail_game
      });

      //4) Append the available game element to the DOM.
    });
  }
}

function doAddListedGame( event ) {
  const inMessage = JSON.parse( event.data );
  if( inMessage.event == "server_list_game" ) {
    const avail_games_area = document.getElementById("column_avail_games_area");
    const avail_game = avail_games_area.appendChild( doComposeAvailGame(
      inMessage.game_name,
      "Time is on our side",
      getHexColor( inMessage.game_name.charAt(0).toUpperCase() ),
      inMessage.game_name.charAt(0).toUpperCase(),
      inMessage.game_id,
      this 
    ));

    PostedGames.push({
      game_name: inMessage.game_name,
      game_icon: inMessage.game_name.charAt(0).toUpperCase(),
      game_color: getHexColor( inMessage.game_name.charAt(0).toUpperCase() ),
      game_id: inMessage.game_id,
      UID: inMessage.game_id,
      DOM_reference: avail_game
    });
  }
}

function doRemoveListedGame( event ) {
  const inMessage = JSON.parse( event.data );
  if( inMessage.event == "server_delist_game" ) {
    //1) Find the index position of the game to remove in PostedGames.
    const RemoveGameIndex =
      PostedGames.findIndex( (game) => game.game_id == inMessage.game_id );

    //2) Remove the game from the DOM.
    PostedGames[RemoveGameIndex].DOM_reference.remove();

    //3) Remove the game from PostedGames.
    PostedGames.splice( RemoveGameIndex, 1 );
  }
}

function doListOwnGame( PostedGames, inGameID ) {
  //1) Add the own game into PostedGames.

  //2) Add the own game to the DOM.
}

function doDelistOwnGame( PostedGames, inGameID ) {
  //1) Remove the own game from PostedGames.

  //2) Remove the own game from the DOM.
}