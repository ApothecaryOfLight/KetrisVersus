'use strict';


/*
Function that attempts a login with the provided credentials.

websocket: Websocket connection to the server.

username: Provided username credential.

password: Provided password credential.
*/
function doLogin( websocket, username, password ) {
  const login = {
    event : "client_login",
    username : username,
    password : password
  }
  const login_text = JSON.stringify( login );
  websocket.send( login_text );
}


/*
Attempts to create an account with the provided credentials.

websocket: Websocket connection to the server.

username: Provided username credential.

password: Provided password credential.
*/
function doCreateAccount( websocket, username, password ) {
  const account_creation = {
    event: "client_account_creation",
    username: username,
    password: password
  }
  const account_creation_text = JSON.stringify( account_creation );
  websocket.send( account_creation_text );
}


/*
Function to be called upon login button click.
*/
function event_login_click( event ) {
  //Get references to the username and password text fields.
  let username_box = document.getElementById('login_username');
  let password_box = document.getElementById('login_password');
  
  //Get the text content from the username and password text fields.
  let username = username_box.value;
  let password = password_box.value;

  //Ensure that credentials have been provided in their respective text fields.
  if( username != "" && password != "" ) {
    //Send login attempt to the server.
    doLogin( this, username, password );
  }
}


/*
Function called upon Create Account button click.
*/
function event_account_creation_click( event ) {
  //Get references to the username and password text fields.
  let username_box = document.getElementById('login_username');
  let password_box = document.getElementById('login_password');
  
  //Get the text content from the username and password text fields.
  let username = username_box.value;
  let password = password_box.value;
  
  //Ensure that credentials have been provided in their respective text fields.
  if( username != "" && password != "" ) {
    //Send account creation to the server.
    doCreateAccount( this, username, password );
  }
}


/*
Function called upon receiving from the server a login approval.
*/
function ws_event_server_login_approval( event ) {
  //Check the received event data.
  if( event.data === "server_login_approved" ) {
    //Show the chat interface and hide the login and game interfaces.
    switchInterface( "chat", this );

    //Launch the chat interface.
    launch_ChatInterface( this );
  }
}


/*
Function called upon receiving from the server a login failure.
*/
function ws_event_server_login_failure( event ) {
  //Check the received event data.
  if( event.data === "server_login_failed" ) {
    //Launch a popup modal to tell the user that their login failed.
    launch_modal(
      "Login failed.", //Title of the modal.
      "Failed to authenticate login credentials!", //Message of the modal.
      [{
        text: "Close", //Text of the button.
        func: "close_modal()" //Function to be attached to the button.
      }] //Button for the modal.
    );
  }
}


/*
Function called upon receiving from the server an account creation failure.
*/
function ws_event_server_account_creation_failure( event ) {
  //Check the received event data.
  if( event.data === "server_account_creation_failure" ) {
    //Launch a popup modal to tell the user that their account creation failed.
    launch_modal(
      "Account creation failed.", //Title of the modal.
      "Failed to create user account!", //Message of the modal.
      [{
        text: "Close", //Text of the button.
        func: "close_modal()" //Function to be attached to the button.
      }] //Button for the modal.
    );
  }
}