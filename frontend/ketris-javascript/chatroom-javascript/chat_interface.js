'use strict';

/*function ws_event_server_ping( event ) {
  const inMessage = JSON.parse( event.data );
  if( inMessage.event === "ping" ) {
    const pong_message = JSON.stringify({
      event: "pong"
    });

  }
}*/

/*
Chat Interface
*/
function send_chat_message( ws, inMessage ) {
    const send_message = {
      event : "client_chat_message",
      text : inMessage
    }
    const send_message_json = JSON.stringify( send_message );
    ws.send( send_message_json );
  }
  
  function ws_event_server_enter_game( event ) {
    const inMessage = JSON.parse( event.data );
    if( inMessage.event === "server_enter_game" ) {
      console.log( "ws_event_server_enter_game" );
      launchGameInterface( ip, inMessage.game_id );
    }
  }
  
  function event_send_button( event ) {
    console.log( "event_send_button" );
  
    let myInputText = document.getElementById( "input_text" );
    const input_text = myInputText.value;
    if( input_text != "" ) {
      send_chat_message( this, input_text );
    }
    myInputText.value = "";
    myInputText.focus()
  }
  
  function event_enter_send_message( event ) {
    console.log( "event_enter_send_message" );
  
    let myInputText = document.getElementById("input_text");
    if( event.key === "Enter" ) {
      event.preventDefault();
      console.log( "enter!" );
      const textfield = myInputText.value;
      if( textfield != "" ) {
        send_chat_message( this, textfield );
      }
      myInputText.value = "";
    }
  }
  
  function event_start_new_game_button( event ) {
    console.log( "event_start_new_game_button" );
    let myNewGameButton = document.getElementById("start_new_game_button");
    this.send( JSON.stringify({
      event: "client_new_game"
    }));
  }