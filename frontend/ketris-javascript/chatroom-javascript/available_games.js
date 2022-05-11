'use strict';

const PostedGames = [];
const OwnGame = { has_game: false };

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
    console.log( "doAddAllListedGames" );
    console.dir( inMessage.game_list );
    
    PostedGames.splice(
      0,
      PostedGames.length
    );
    
    const avail_games_area = document.getElementById("avail_games_area");
    console.dir( JSON.parse( JSON.stringify( avail_games_area ) ) );
    console.log( avail_games_area.firstChild );
    while( avail_games_area.firstChild != null ) {
      console.log("blanking");
      avail_games_area.firstChild.remove();
    }

    //Iterate through each posted game.
    inMessage.game_list.map( (game) => {
      //1) Create the element fragment.
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
    });
  }
}

function doAddListedGame( event ) {
  const inMessage = JSON.parse( event.data );
  if( inMessage.event == "server_list_game" ) {
    console.log("doAddListedGame");

    console.dir( inMessage );

    const avail_games_area = document.getElementById("avail_games_area");
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

    if( RemoveGameIndex != -1 ) {
      //2) Remove the game from the DOM.
      PostedGames[RemoveGameIndex].DOM_reference.remove();

      //3) Remove the game from PostedGames.
      PostedGames.splice( RemoveGameIndex, 1 );
    }
  }
}

function ws_event_server_game_posting_success( event ) {
  const inMessage = JSON.parse( event.data );
  if( inMessage.event == "server_game_posting_sucess" ) {
    doListOwnGame()
  }
}

function doListOwnGame() {
  if( !OwnGame.has_game ) {
    const avail_games_area = document.getElementById("avail_games_area");

    const avail_game_wrapper = document.createElement("div");
    avail_game_wrapper.className = "avail_game_wrapper_class";

    const avail_game = document.createElement("div");
    avail_game.className = "avail_game_class";
    avail_game.innerText = "You have a game posted!";
    avail_game_wrapper.appendChild( avail_game );

    OwnGame.reference = avail_games_area.insertBefore( avail_game_wrapper, avail_games_area.firstChild );
    OwnGame.has_game = true;
  }
}

function doDelistOwnGame() {
  OwnGame.reference.remove();
  OwnGame.reference = null;
  OwnGame.has_game = false;

  let myNewGameButton = document.getElementById("start_new_game_button");
  let myCancelGameButton = document.getElementById("cancel_new_game_button");
  myNewGameButton.style.display = "flex";
  myCancelGameButton.style.display = "none";
}


function requestGamesList( inWebsocket ) {
  console.log("requesting games list");
  const requestGamesList = {
    event : "requestGamesList"
  }
  const requestGamesList_string = JSON.stringify( requestGamesList );
  inWebsocket.send( requestGamesList_string );
}