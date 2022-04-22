'use strict';

var ws;


/*
Function called when a Websocket connection to the server is opened.
*/
function ws_event_websocket_opened( event ) {
  //Remove the event listener that resulted in this function being called, as the
  //websocket has already been opened.
  event.srcElement.removeEventListener( 'click', event_listener_dictionary["event_websocket_opened"] );

  //Add an event listener for the server ping.
  ws.addEventListener( "message", (message_obj) => {
    //Check the message type.
    if( message_obj.type == "server_event" ) {
      //Parse the message content.
      const message = JSON.parse( message_obj.data );
      //Check the event type to determine that it is a ping.
      if( message.event == "ping" ) {
        //Send a pong response.
        ws.send( JSON.stringify({
          type: "chat_client_event",
          event: "pong"
        }))
      }
    }
  })
}


/*
Event to be called upon Websocket closing.
*/
function ws_event_websocket_closed( event ) {  
  //Create an Array of Objects that will be used to create the modal's buttons.
  const options = [{
    text: "Close",
    func: "close_modal()"
  }];

  //Launch the popup modal informing the user that the connection with the server has
  //been closed.
  launch_modal(
    null,
    "Connection with server lost! Attempt refresh, please.",
    options
  );
}


/*
Attempt to open the Websocket to the chat server.
*/
try{
  const chatroom_address = ip + ":3002";
  console.log( "Connecting to chat server @ " + chatroom_address + "." );
  ws = new WebSocket( chatroom_address );
} catch( error ) {
  console.error( error );
}


//Build the event listener dictionary.
build_event_listener_dictionary( ws );


//Launch the login interface.
switchInterface( "login", ws );