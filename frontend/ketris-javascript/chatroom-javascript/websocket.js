'use strict';

var ws;

function ws_event_websocket_opened( event ) {
  console.log( "Websocket opened @ " + new Date().toString() + "!" );
  event.srcElement.removeEventListener( 'click', event_listener_dictionary["event_websocket_opened"] );

  ws.send( JSON.stringify({
    type: "chat_client_event",
    event: "websocket_open_success"
  }))

  ws.addEventListener( "message", (message_obj) => {
    if( message_obj.type == "server_event" ) {
      const message = JSON.parse( message_obj.data );
      if( message.event == "ping" ) {
        ws.send( JSON.stringify({
          type: "chat_client_event",
          event: "pong"
        }))
      }
    }
  })
}

function ws_event_websocket_closed( event ) {
  console.log( "Websocket closed @ " + new Date().toString() + "!" );
  console.dir( event );
  
  const options = {
    "Close" : close_modal
  }
  launch_modal( null, "Connection with server lost! Attempt refresh, please.", options );
}

try{
  console.log( ip + ":3002" );
  ws = new WebSocket( ip + ":3002" );
} catch( error ) {
  console.error( error );
}

build_event_listener_dictionary( ws );
launch_LoginInterface( ws );