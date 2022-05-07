'use strict';


/*
This function sends a chat message from this user to the server.

ws: Websocket connection to the server.

inMessage: Chat message to be sent to the server.
*/
function send_chat_message( ws, inMessage ) {
  const send_message = {
    event : "client_chat_message",
    text : inMessage
  }
  const send_message_json = JSON.stringify( send_message );
  ws.send( send_message_json );
}


/*
This function is triggered when this user accepts a game posted by another user,
sending an event to the server that will start the game between these two players.

event: Contains the game_id representing the game to be launched.
*/
function ws_event_server_enter_game( event ) {
  const inMessage = JSON.parse( event.data );
  if( inMessage.event === "server_enter_game" ) {
    //Hide the login/chat interfaces, show the game interface, and attach game event listeners.
    switchInterface( "game", this );
  
    //Launch the game itself.
    launchKetris( ip, inMessage.game_id, this );
  }
}


/*
This function is triggered on pressing the Send Message button to send a chat message.
*/
function event_send_button() {
  let myInputText = document.getElementById( "input_text" );
  const input_text = myInputText.value;
  if( input_text != "" ) {
    send_chat_message( this, input_text );
  }
  myInputText.value = "";
  myInputText.focus()
}


/*
This function is triggered on pressing the Enter key to send a chat message.

event: Contains the keypress event details.
*/
function event_enter_send_message( event ) {
  let myInputText = document.getElementById("input_text");
  if( event.key === "Enter" ) {
    event.preventDefault();
    const textfield = myInputText.value;
    if( textfield != "" ) {
      send_chat_message( this, textfield );
    }
    myInputText.value = "";
  }
}


/*
This function is triggered upon this user clicking the Start New Game button,
sending to the server a request to create a new posted game that other users
can then accept to start a Ketris match.
*/
function event_start_new_game_button() {
  this.send( JSON.stringify({
    event: "client_new_game"
  }));
  let myNewGameButton = document.getElementById("start_new_game_button");
  let myCancelGameButton = document.getElementById("cancel_new_game_button");
  myNewGameButton.style.display = "none";
  myCancelGameButton.style.display = "flex";
}


/*
This function is triggered upon this user clicking the Cancel Game button,
sending to the server a request to delete the game this user created. The
server will then notify all other connected users that this game has been
deleted.
*/
function event_cancel_new_game_button() {
  this.send( JSON.stringify({
    event: "client_cancel_game"
  }));
  let myNewGameButton = document.getElementById("start_new_game_button");
  let myCancelGameButton = document.getElementById("cancel_new_game_button");
  myNewGameButton.style.display = "flex";
  myCancelGameButton.style.display = "none";
}