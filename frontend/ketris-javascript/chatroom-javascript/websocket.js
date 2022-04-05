'use strict';

var ws;

function ws_event_websocket_opened( event ) {
    console.log( "Websocket opened!" );
    event.srcElement.removeEventListener( 'click', event_listener_dictionary["event_websocket_opened"] );
  }

try{
  console.log( ip + ":3002" );
  ws = new WebSocket( ip + ":3002" );
} catch( error ) {
  console.error( error );
}
build_event_listener_dictionary( ws );
launch_LoginInterface( ws );