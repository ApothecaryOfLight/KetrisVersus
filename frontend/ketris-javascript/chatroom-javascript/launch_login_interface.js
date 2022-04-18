'use strict';


/*
Launch the login interface.
*/
function launch_LoginInterface( ws ) {
  //Attach event listeners for the login interface.
  attach_event( "login_button", 'click', "event_login_click" );
  attach_event( "create_account_button", 'click', "event_account_creation_click" );
  attach_ws_event( ws, 'open', "ws_event_websocket_opened" );
  attach_ws_event( ws, 'close', "ws_event_websocket_closed" );
  attach_ws_event( ws, 'message', "ws_event_server_login_approval" );
  attach_ws_event( ws, 'message', "ws_event_server_login_failure" );
  attach_ws_event( ws, 'message', "ws_event_server_account_creation_failure" );

  //Get references to the interfaces, and hide the chat interface.
  let login_interface = document.getElementById('login_interface');
  let chat_interface = document.getElementById('chat_interface');
  let contact_dev_popup = document.getElementById('contact_dev_popup');

  chat_interface.style.display = "none";
}


/*
Detach the event listeners for the login interface.
*/
function cleanup_LoginInterface( ws ) {
  detach_event( "login_button", 'click', "event_login_click" );
  detach_event( "create_account_button", 'click', "event_account_creation_click" );
  detach_ws_event( ws, 'open', "ws_event_websocket_opened" );
  detach_ws_event( ws, 'message', "ws_event_server_login_approval" );
}