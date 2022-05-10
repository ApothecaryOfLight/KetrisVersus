'use strict';


//Global Object storing event listeners.
let event_listener_dictionary = {};


/*
Function that constructs the event listener Object, binding the listener functions
as the value cooresponding to the cooresponding function name as a String ket.
*/
function build_event_listener_dictionary( ws, user_obj ) {
  /* Websocket events */
  event_listener_dictionary["ws_event_websocket_opened"] =
    ws_event_websocket_opened.bind( ws );
  event_listener_dictionary["ws_event_websocket_closed"] =
    ws_event_websocket_closed.bind( ws, user_obj );
  event_listener_dictionary["ws_event_websocket_error"] =
    ws_event_websocket_error.bind( ws, user_obj );

  /* Login events */
  event_listener_dictionary["event_login_click"] =
    event_login_click.bind( ws, user_obj );
  event_listener_dictionary["event_login_enter"] =
    event_login_enter.bind( ws, user_obj );
  event_listener_dictionary["event_account_creation_click"] =
    event_account_creation_click.bind( ws, user_obj );
  event_listener_dictionary["ws_event_server_login_approval"] =
    ws_event_server_login_approval.bind( ws, user_obj );
  event_listener_dictionary["ws_event_server_login_failure"] =
    ws_event_server_login_failure.bind( ws );
  event_listener_dictionary["ws_event_server_account_creation_failure"] =
    ws_event_server_account_creation_failure.bind( ws );

  /* Chat events */
  event_listener_dictionary["event_send_button"] = event_send_button.bind( ws );
  event_listener_dictionary["event_enter_send_message"] = event_enter_send_message.bind( ws );
  event_listener_dictionary["event_start_new_game_button"] = event_start_new_game_button.bind( ws );
  event_listener_dictionary["event_cancel_new_game_button"] = event_cancel_new_game_button.bind( ws );
  event_listener_dictionary["addToChatLog"] = addToChatLog.bind( ws );
  event_listener_dictionary["addUser"] = addUser.bind( ws );
  event_listener_dictionary["removeUser"] = removeUser.bind( ws );
  event_listener_dictionary["addUserList"] = addUserList.bind( ws );

  /* Posted Game Events */
  event_listener_dictionary["ws_event_server_enter_game"] = ws_event_server_enter_game.bind( ws );
  event_listener_dictionary["ws_event_server_game_posting_success"] = ws_event_server_game_posting_success.bind( ws );
  event_listener_dictionary["doAddListedGame"] = doAddListedGame.bind( ws );
  event_listener_dictionary["doRemoveListedGame"] = doRemoveListedGame.bind( ws );
  event_listener_dictionary["doAddAllListedGames"] = doAddAllListedGames.bind( ws );
  
  /* Chat events: Contact dev popup*/
  event_listener_dictionary["event_launch_contact_dev_popup"] = event_launch_contact_dev_popup.bind( ws );
  event_listener_dictionary["event_close_contact_dev_popup"] = event_close_contact_dev_popup.bind( ws );
  event_listener_dictionary["event_send_contact_dev_message"] = event_send_contact_dev_message.bind( ws );
}


/*
Attach an event listener to a DOM element.

DOM_ID: The element to attach the event listener to.

event: The event to listen for.

function_name: Name of the function to attach to the DOM element specified.
*/
function attach_event( DOM_ID, event, function_name ) {
  try {
    //Ensure that the arguments are specified.
    if( typeof(DOM_ID) === "undefined" ) { throw "DOM Element undefined!"; }
    if( typeof(event) === "undefined" ) { throw "Event undefined!"; }
    if( typeof(function_name) === "undefined" ) { throw "Function undefined!"; }

    //Attach the event listener.
    let dom_element_handle = document.getElementById( DOM_ID );
    dom_element_handle.addEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}


/*
Detach an event listener from a DOM element.

DOM_ID: The element to dettach an event listener from.

event: The event listened for..

function_name: Name of the function to detach from the DOM element specified.
*/
function detach_event( DOM_ID, event, function_name ) {
  try {
    //Ensure that the arguments are specified.
    if( typeof(DOM_ID) === "undefined" ) { throw "DOM Element undefined!"; }
    if( typeof(event) === "undefined" ) { throw "Event undefined!"; }
    if( typeof(function_name) === "undefined" ) { throw "Function undefined!"; }
    
    //Remove the event listener.
    let dom_element_handle = document.getElementById( DOM_ID );
    dom_element_handle.removeEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}


/*
Attach an event listener to the provided Websocket.

ws: Websocket connection to the server.

event: Event to listen for.

function_name: Function to execute upon the event being triggered.
*/
function attach_ws_event( ws, event, function_name ) {
  try {
    //Ensure that the arguments are specified.
    if( typeof(ws) === "undefined" ) { throw "Websocket undefined!"; }
    if( typeof(event) === "undefined" ) { throw "Event undefined!"; }
    if( typeof(function_name) === "undefined" ) { throw "Function undefined!"; }
    
    //Attach the event listener.
    ws.addEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}


/*
Detach an event listener from the provided Websocket.

ws: Websocket connection to the server.

event: Event listened for.

function_name: Function to detach from the event listener.
*/
function detach_ws_event( ws, event, function_name ) {
  try {
    //Ensure that the arguments are specified.
    if( typeof(ws) === "undefined" ) { throw "Websocket undefined!"; }
    if( typeof(event) === "undefined" ) { throw "Event undefined!"; }
    if( typeof(function_name) === "undefined" ) { throw "Function undefined!"; }

    //Remove the event listener.
    ws.removeEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}


function attach_key_event( DOM_ID, function_name ) {
  const dom_reference = document.getElementById( DOM_ID );
  dom_reference.addEventListener( "keydown", event_listener_dictionary["event_login_enter"] );
}

function detach_key_event( DOM_ID, function_name ) {
  const dom_reference = document.getElementById( DOM_ID );
  dom_reference.removeEventListener( "keydown", event_listener_dictionary["event_login_enter"] );
}

function attachWebsocketEvents( websocket ) {
  try {
    //Basic websocket events.
    attach_ws_event( websocket, 'open', "ws_event_websocket_opened" );
    attach_ws_event( websocket, 'error', "ws_event_websocket_error" );
    attach_ws_event( websocket, 'close', "ws_event_websocket_closed" );
  } catch( error ) {
    console.error( error );
  }
}

function detachWebsocketEvents( websocket ) {
  try {
    //Basic websocket events.
    detach_ws_event( websocket, 'open', "ws_event_websocket_opened" );
  } catch( error ) {
    console.error( error );
  }
}


function attachLoginEvents( websocket ) {
  try {
    //Login/account creation button events
    attach_event( "login_button", 'click', "event_login_click" );
    attach_key_event( "login_username", "event_login_enter" );
    attach_key_event( "login_password", "event_login_enter" );
    attach_event( "create_account_button", 'click', "event_account_creation_click" );


    //Login, account creation websocket events.
    attach_ws_event( websocket, 'message', "ws_event_server_login_approval" );
    attach_ws_event( websocket, 'message', "ws_event_server_login_failure" );
    attach_ws_event( websocket, 'message', "ws_event_server_account_creation_failure" );
  } catch( error ) {
    console.error( error );
  }
}

function detachLoginEvents( websocket ) {
  try {
    //Login/account creation button events
    detach_event( "login_button", 'click', "event_login_click" );
    detach_key_event( "login_username", "event_login_enter" );
    detach_key_event( "login_password", "event_login_enter" );
    detach_event( "create_account_button", 'click', "event_account_creation_click" );

    //Login, account creation websocket events.
    detach_ws_event( websocket, 'message', "ws_event_server_login_approval" );
    detach_ws_event( websocket, 'message', "ws_event_server_account_creation_failure" );
  } catch( error ) {
    console.error( error );
  }
}

function attachChatEvents( websocket ) {
  try {
    //Contact dev events.
    attach_event( 'contact_dev_button', 'click', "event_launch_contact_dev_popup" );
    attach_event( 'contact_dev_popup_exit_button', 'click', "event_close_contact_dev_popup" );
    attach_event( 'contact_dev_popup_send_button', 'click', "event_send_contact_dev_message" );

    //Send chat message events.
    attach_event( 'input_text', 'keydown', "event_enter_send_message" );
    attach_event( 'send_button', 'click', 'event_send_button' );

    //Receive chat message event
    attach_ws_event( websocket, 'message', "addToChatLog" );

    //User events
    attach_ws_event( websocket, 'message', "addUser" );
    attach_ws_event( websocket, 'message', "removeUser" );
    attach_ws_event( websocket, 'message', "addUserList" );

    //Posted games events
    attach_ws_event( websocket, 'message', "doAddListedGame" );
    attach_ws_event( websocket, 'message', "ws_event_server_game_posting_success" );
    attach_ws_event( websocket, 'message', "doRemoveListedGame" );
    attach_ws_event( websocket, 'message', "doAddAllListedGames" );

    //Start and enter game events.
    attach_event( 'start_new_game_button', 'click', 'event_start_new_game_button' );
    attach_event( 'cancel_new_game_button', 'click', 'event_cancel_new_game_button' );
    attach_ws_event( websocket, 'message', "ws_event_server_enter_game" );
  } catch( error ) {
    console.error( error );
  }
}

function detachChatEvents( websocket ) {
  try {
    //Contact dev events.
    detach_event( 'contact_dev_button', 'click', "event_launch_contact_dev_popup" );
    detach_event( 'contact_dev_popup_exit_button', 'click', "event_close_contact_dev_popup" );
    detach_event( 'contact_dev_popup_send_button', 'click', "event_send_contact_dev_message" );

    //Send chat message events.
    detach_event( 'input_text', 'keydown', "event_enter_send_message" );
    detach_event( 'send_button', 'click', 'event_send_button' );

    //Receive chat message event
    detach_ws_event( websocket, 'message', "addToChatLog" );

    //User events
    detach_ws_event( websocket, 'message', "addUser" );
    detach_ws_event( websocket, 'message', "removeUser" );
    detach_ws_event( websocket, 'message', "addUserList" );

    //Posted games events
    detach_ws_event( websocket, 'message', "ws_event_server_list_game" );
    detach_ws_event( websocket, 'message', "ws_event_server_game_posting_success" );
    detach_ws_event( websocket, 'message', "ws_event_server_server_delist_game" );
    detach_ws_event( websocket, 'message', "ws_event_server_game_list" );

    //Start and enter game events.
    detach_event( 'start_new_game_button', 'click', 'event_start_new_game_button' );  
    detach_event( 'cancel_new_game_button', 'click', 'event_cancel_new_game_button' );  
    detach_ws_event( websocket, 'message', "ws_event_server_enter_game" );
  } catch( error ) {
    console.error( error );
  }
}

function attachGameEvents() {

}

function detachGameEvents() {

}