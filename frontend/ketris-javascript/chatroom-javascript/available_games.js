'use strict';

const PostedGames = [];
const OwnGame = { has_game: false };


/*
Function called when a client selects a game to join.

inGameID: ID of selected game.

inGameNamE: Name of selected game.

inWebsocket: Connection to chat server.
*/
function join_game_ws( inGameID, inGameName, inWebsocket ) {
  //Send a message to the chat server that a game has been selected.
  inWebsocket.send(JSON.stringify({
    event: "client_enter_game",
    game_id: inGameID,
    game_name: inGameName
  }));
}


/*
Create an HTML element for an available game.

inStartingUser: The username of the user who posted the game.

inTimestamp: The creation time of the game.

inGameColor: A color based on the firt letter of the posting user's username.

inGameIcon: An icon based on the first letter of the posting user's username.

inGameID: ID representing the posted game.

inWebsocket: Connection to chat server.
*/
function doComposeAvailGame( inStartingUser, inTimestamp, inGameColor, inGameIcon, inGameID, inWebsocket ) {
  //Create an HTML element to hold the entire available game.
  const avail_game_wrapper = document.createElement("div");
  avail_game_wrapper.className = "avail_game_wrapper_class";

  //Create an HTML element to contain the elements themselves.
  const avail_game = document.createElement("div");
  avail_game.className = "avail_game_class";
  avail_game_wrapper.appendChild( avail_game );

  //Compose left side.
  const avail_game_left = document.createElement("div");
  avail_game_left.className = "avail_game_left_class";
  avail_game.appendChild( avail_game_left );

  //Compose icon.
  const avail_game_icon = document.createElement("div");
  avail_game_icon.className = "avail_game_icon_class";
  avail_game_icon.style.backgroundColor = inGameColor;
  avail_game_icon.innerText = inGameIcon;
  avail_game_left.appendChild( avail_game_icon );

  //Compose username.
  const avail_game_username = document.createElement("div");
  avail_game_username.className = "avail_game_username_class";
  avail_game_username.innerText = inStartingUser;
  avail_game_left.appendChild( avail_game_username );

  //Compose timestamp.
  const avail_game_timestamp = document.createElement("div");
  avail_game_timestamp.className = "avail_game_timestamp";
  avail_game_timestamp.innerText = inTimestamp;
  avail_game_left.appendChild( avail_game_timestamp );

  //Compose right side
  const avail_game_right = document.createElement("div");
  avail_game_right.className = "avail_game_right_class";
  avail_game.appendChild( avail_game_right );

  //Compose the join button.
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

  //Return the composed element.
  return avail_game_wrapper;
}


/*
Function to list all available games.

This is only to be called when the client needs to completely repopulate the list
of available games.

event: JSON server message containing the server game list.
*/
function doAddAllListedGames( event ) {
  //Parse the server event.
  const inMessage = JSON.parse( event.data );

  //If the server event is indeed a server game list, then:
  if( inMessage.event == "server_game_list" ) {    
    //Empty the PostedGames array.
    PostedGames.splice(
      0,
      PostedGames.length
    );
    
    //Delete any existing posted games in the DOM.
    const avail_games_area = document.getElementById("avail_games_area");
    while( avail_games_area.firstChild != null ) {
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


/*
This function is called when a new game is posted by another user.

event: Message from server.
*/
function doAddListedGame( event ) {
  //Parse the server event.
  const inMessage = JSON.parse( event.data );

  //If the event is indeed a new game being listed:
  if( inMessage.event == "server_list_game" ) {
    //Get a reference to the area where posted games will be listed.
    const avail_games_area = document.getElementById("avail_games_area");

    //Process the JSON object into HTML elements and append them to the DOM.
    const avail_game = avail_games_area.appendChild( doComposeAvailGame(
      inMessage.game_name,
      "Time is on our side",
      getHexColor( inMessage.game_name.charAt(0).toUpperCase() ),
      inMessage.game_name.charAt(0).toUpperCase(),
      inMessage.game_id,
      this 
    ));

    //Remember game information and, in particular, a reference to the DOM for
    //later deletion.
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


/*
Function to be called upon game deletion.

event: Message from server.
*/
function doRemoveListedGame( event ) {
  //Parse the message from the server.
  const inMessage = JSON.parse( event.data );

  //If the event is indeed a game deletion:
  if( inMessage.event == "server_delist_game" ) {
    //1) Find the index position of the game to remove in PostedGames.
    const RemoveGameIndex =
      PostedGames.findIndex( (game) => game.game_id == inMessage.game_id );

    //Guarantee that the game in question exists, and if so:
    if( RemoveGameIndex != -1 ) {
      //2) Remove the game from the DOM.
      PostedGames[RemoveGameIndex].DOM_reference.remove();

      //3) Remove the game from PostedGames.
      PostedGames.splice( RemoveGameIndex, 1 );
    }
  }
}


/*
Function to be called upon sucessfully listing client's own game with the server.

event: Message from server.
*/
function ws_event_server_game_posting_success( event ) {
  const inMessage = JSON.parse( event.data );
  if( inMessage.event == "server_game_posting_sucess" ) {
    doListOwnGame()
  }
}


/*
When the server confirms that the player has successfully posted a new game, the
user needs to be notified of this sucesss. This function will create a placeholder
in the available games list, informing the player that they have posted a game.
*/
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


/*
When the user's own posted game is deleted, for whatever reason, it needs to be
removed from the DOM.
*/
function doDelistOwnGame() {
  //Remove the element.
  OwnGame.reference.remove();

  //Forget the reference to the now removed element.
  OwnGame.reference = null;

  //Remember that the user doesn't have a game posted.
  OwnGame.has_game = false;

  //Toggle between cancel game and start new game buttons.
  let myNewGameButton = document.getElementById("start_new_game_button");
  let myCancelGameButton = document.getElementById("cancel_new_game_button");
  myNewGameButton.style.display = "flex";
  myCancelGameButton.style.display = "none";
}


/*
Function to request a full list of games from the server.

Called upon switching into chat interface from login or games interfaces.

inWebsocket: Connection to chat server.
*/
function requestGamesList( inWebsocket ) {
  //Create the message.
  const requestGamesList = {
    event : "requestGamesList"
  }
  const requestGamesList_string = JSON.stringify( requestGamesList );

  //Send the message.
  inWebsocket.send( requestGamesList_string );
}