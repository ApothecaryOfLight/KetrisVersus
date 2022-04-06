'use strict';

var ws;
let chatroomKeepAlive;

function ws_event_websocket_opened( event ) {
  console.log( "Websocket opened!" );
  event.srcElement.removeEventListener( 'click', event_listener_dictionary["event_websocket_opened"] );
  chatroomKeepAlive = setInterval(
    () => {
      ws.send( JSON.stringify({
        type: "connection",
        event: "keep_alive"
      }));
    },
    49000
  );
}

function ws_event_websocket_closed( event ) {
  console.log( "Websocket closed!" );
  console.dir( event );
  
  const options = {
    "Close" : close_modal
  }
  launch_modal( null, "Connection with server lost! Attempt refresh, please.", options );
}

function ws_event_kept_alive( event ) {
  
}

try{
  console.log( ip + ":3002" );
  ws = new WebSocket( ip + ":3002" );
} catch( error ) {
  console.error( error );
}

build_event_listener_dictionary( ws );
launch_LoginInterface( ws );