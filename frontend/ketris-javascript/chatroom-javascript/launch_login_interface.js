'use strict';

function launch_LoginInterface( ws ) {
    console.log( "Launching login interface." );
  
    attach_event( "login_button", 'click', "event_login_click" );
    attach_event( "create_account_button", 'click', "event_account_creation_click" );
    attach_ws_event( ws, 'open', "ws_event_websocket_opened" );
    attach_ws_event( ws, 'message', "ws_event_server_login_approval" );
    attach_ws_event( ws, 'message', "ws_event_server_login_failure" );
    attach_ws_event( ws, 'message', "ws_event_server_account_creation_failure" );
  
    let login_interface = document.getElementById('login_interface');
    let chat_interface = document.getElementById('chat_interface');
    let contact_dev_popup = document.getElementById('contact_dev_popup');
  
    chat_interface.style.display = "none";
  }
  
  function cleanup_LoginInterface( ws ) {
    console.log( "Cleaning up login interface." );
  
    detach_event( "login_button", 'click', "event_login_click" );
    detach_event( "create_account_button", 'click', "event_account_creation_click" );
    detach_ws_event( ws, 'open', "ws_event_websocket_opened" );
    detach_ws_event( ws, 'message', "ws_event_server_login_approval" );
  }