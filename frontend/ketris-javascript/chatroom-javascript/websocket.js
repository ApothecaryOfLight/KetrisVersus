'use strict';

var ws;

function ws_event_websocket_opened( event ) {
  console.log( "Websocket opened!" );
  event.srcElement.removeEventListener( 'click', event_listener_dictionary["event_websocket_opened"] );

  ws.send( JSON.stringify({
    type: "chat_client_event",
    event: "websocket_open_success"
  }))

  ws.addEventListener( "message", (message_obj) => {
    const message = JSON.parse( message_obj.data );
    if( message.type == "server_event" ) {
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
  console.log( "Websocket closed!" );
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