'use strict';


/*
This function sends a chat message from this user to the server.

ws: Websocket connection to the server.

inMessage: Chat message to be sent to the server.
*/
function send_chat_message( ws, inMessage ) {
  //Create message.
  const send_message = {
    event : "client_chat_message",
    text : inMessage
  }
  const send_message_json = JSON.stringify( send_message );

  //Send message.
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

    if( OwnGame.has_game ) {
      doDelistOwnGame();
    }
  
    //Launch the game itself.
    launchKetris( ip, inMessage.game_id, this );
  }
}


/*
This function is triggered on pressing the Send Message button to send a chat message.
*/
function event_send_button() {
  //Get a reference to the text input area.
  let myInputText = document.getElementById( "input_text" );

  //Get the text value stored there.
  const input_text = myInputText.value;

  //If there is a value there, then:
  if( input_text != "" ) {
    //Send the chat message to the server.
    send_chat_message( this, input_text );
  }

  //Set the text value of the chat bar to empty.
  myInputText.value = "";

  //Return the focus to the chat bar so that users can keep typing.
  myInputText.focus()
}


/*
This function is triggered on pressing the Enter key to send a chat message.

event: Contains the keypress event details.
*/
function event_enter_send_message( event ) {
  //Get a reference to the input text element.
  let myInputText = document.getElementById("input_text");

  //If the key pressed is indeed enter, then:
  if( event.key === "Enter" ) {
    //Prevent enter from doing its usual business (new line).
    event.preventDefault();

    //Get the value of the text field.
    const textfield = myInputText.value;

    //If the text field is not empty, then:
    if( textfield != "" ) {
      //Send the chat message.
      send_chat_message( this, textfield );
    }

    //Empty the chat input field.
    myInputText.value = "";
  }
}


/*
This function is triggered upon this user clicking the Start New Game button,
sending to the server a request to create a new posted game that other users
can then accept to start a Ketris match.
*/
function event_start_new_game_button() {
  //Send a message to the server that the user has created a game.
  this.send( JSON.stringify({
    event: "client_new_game"
  }));

  //Toggle between start new game button and cancel game button.
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
  //Send an event to the server that the user's posted game has been canceled.
  this.send( JSON.stringify({
    event: "client_cancel_game"
  }));

  //Toggle between cancel game button and start new game button.
  let myNewGameButton = document.getElementById("start_new_game_button");
  let myCancelGameButton = document.getElementById("cancel_new_game_button");
  myNewGameButton.style.display = "flex";
  myCancelGameButton.style.display = "none";

  //If the user has their own game posted, ensure that it is deleted locally and
  //removed from the DOM.
  if( OwnGame.has_game ) {
    doDelistOwnGame();
  }
}