'use strict';

var ws;


/*
Function called when a Websocket connection to the server is opened.
*/
function ws_event_websocket_opened( event ) {
  console.log( "Websocket opened." );
  //Remove the event listener that resulted in this function being called, as the
  //websocket has already been opened.
  event.srcElement.removeEventListener( 'click', event_listener_dictionary["event_websocket_opened"] );

  //Add an event listener for the server ping.
  this.addEventListener( "message", (message_obj) => {
    //Check the message type.
    if( message_obj.type == "server_event" ) {
      //Parse the message content.
      const message = JSON.parse( message_obj.data );
      //Check the event type to determine that it is a ping.
      if( message.event == "ping" ) {
        //Send a pong response.
        this.send( JSON.stringify({
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
function ws_event_websocket_closed( user_obj, event ) {
  const timestamp = Date.now();
  console.log( "Websocket closure event at " + timestamp.toString() + "!" );
  console.dir( event );
  
  //Create an Array of Objects that will be used to create the modal's buttons.
  const options = [{
    text: "Close",
    func: "close_modal()"
  }];

  //Launch the popup modal informing the user that the connection with the server has
  //been closed.
  launch_modal(
    "Connection Error",
    "Connection with chat server lost! Attempt refresh, please.",
    options
  );

  attempt_reopen_websocket( this, user_obj );
}


function attempt_reopen_websocket( old_websocket, user_obj, count ) {
  const chatroom_address = ip + ":3002";

  //Attempt to reopen the socket.
  if( ws.readyState != 1 ) {
    ws = new WebSocket( chatroom_address );
  }

  //If the reopening failed, call this function again.
  if( typeof(count) == "undefined" ) {
    count = 0;
  }
  window.setTimeout( (old_websocket, user_obj, count) => {
    if( ws.readyState == 0 ) {
      count++;
      if( count < 3 ) {
        window.setTimeout( attempt_reopen_websocket, 1000, old_websocket, user_obj, count );
      }
    } else if( ws.readyState == 1 ) {
      detachWebsocketEvents( old_websocket );
      detachChatEvents( old_websocket );
      build_event_listener_dictionary( ws, user_obj );
      attachWebsocketEvents( ws );
      attachLoginEvents( ws );
      if( user_obj.isLogged ) {
        doLogin( ws, user_obj.username, user_obj.password, user_obj );
      }
      //if( user_obj.isLogged ) {
        //user_obj.resend_login = doLogin.bind( null, ws, user_obj.username, user_obj.password, user_obj );
        //ws.addEventListener( 'open', user_obj.resend_login );
        //detachChatEvents( websocket );
        //attachChatEvents( ws );
      //}

      //If the connection error modal is up, take it down.
      const modal_title = document.getElementById("modal_title");
      const modal_title_content = modal_title.innerText;
      if( modal_title_content == "Connection Error" ) {
        close_modal();
      }
    }
  }, 2000, old_websocket, user_obj, count );
}


/*
Event to be called in the event of a Websocket error.
*/
function ws_event_websocket_error( error ) {
  const timestamp = Date.now();
  console.log( "Websocket error at " + timestamp.toString() + "!" );
  console.dir( error );

  //Create an Array of Objects that will be used to create the modal's buttons.
  const options = [{
    text: "Close",
    func: "close_modal()"
  }];

  //Launch the popup modal informing the user that the connection with the server has
  //been closed.
  launch_modal(
    "Error!",
    "Unspecified error. Contact dev, please.",
    options
  );
}


/*
Main function to launch Ketris as a whole.
*/
function main() {
  const user_obj = {
    isLogged: false,
    hasReactMounted: false,
    username: "",
    password: ""
  };

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
  build_event_listener_dictionary( ws, user_obj );


  //Launch the login interface.
  switchInterface( "login", ws );
}


//Launch Ketris as a whole.
main();