'use strict';

/*
Login interface
*/
function doLogin( websocket, username, password ) {
    const login = {
      "event" : "client_login",
      "username" : username,
      "password" : password
    }
    const login_text = JSON.stringify( login );
    websocket.send( login_text );
  }
  
  function doCreateAccount( websocket, username, password ) {
    const account_creation = {
      "event": "client_account_creation",
      "username": username,
      "password": password
    }
    const account_creation_text = JSON.stringify( account_creation );
    websocket.send( account_creation_text );
  }

  function event_login_click( event ) {
    let username_box = document.getElementById('login_username');
    let password_box = document.getElementById('login_password');
    let username = username_box.value;
    let password = password_box.value;
    if( username != "" && password != "" ) {
      console.log( "Attempting login!" );
      doLogin( this, username, password );
    }
  }
  
  function event_account_creation_click( event ) {
    let username_box = document.getElementById('login_username');
    let password_box = document.getElementById('login_password');
    let username = username_box.value;
    let password = password_box.value;
    if( username != "" && password != "" ) {
      console.log( "Attempting account creation!" );
      doCreateAccount( this, username, password );
    }
  }
  
  function ws_event_server_login_approval( event ) {
    if( event.data === "server_login_approved" ) {
      console.log( "Login approved!" );
      cleanup_LoginInterface( this );
      launch_ChatInterface( this );
    }
  }
  
  function ws_event_server_login_failure( event ) {
    if( event.data === "server_login_failed" ) {
      console.log( "Login failed!" );
      launch_modal(
        "Login failed.",
        "Failed to authenticate login credentials!",
        [
          {
            text: "Close",
            func: "close_modal()"
          }
        ]
      );
    }
  }
  
  function ws_event_server_account_creation_failure( event ) {
    if( event.data === "server_account_creation_failure" ) {
      console.log( "Account creation failure!" );
      launch_modal(
        "Account creation failed.",
        "Failed to create user account!",
        [
          {
            text: "Close",
            func: "close_modal()"
          }
        ]
      );
    }
  }