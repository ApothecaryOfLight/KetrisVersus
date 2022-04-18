'use strict';


//Global Object storing event listeners.
let event_listener_dictionary = {};


/*
Function that constructs the event listener Object, binding the listener functions
as the value cooresponding to the cooresponding function name as a String ket.
*/
function build_event_listener_dictionary( ws ) {
  /* Websocket events */
  event_listener_dictionary["ws_event_websocket_opened"] =
    ws_event_websocket_opened.bind( ws );
  event_listener_dictionary["ws_event_websocket_closed"] =
    ws_event_websocket_closed.bind( ws );

  /* Login events */
  event_listener_dictionary["event_login_click"] =
    event_login_click.bind( ws );
  event_listener_dictionary["event_account_creation_click"] =
    event_account_creation_click.bind( ws );
  event_listener_dictionary["ws_event_server_login_approval"] =
    ws_event_server_login_approval.bind( ws );
  event_listener_dictionary["ws_event_server_login_failure"] =
    ws_event_server_login_failure.bind( ws );
  event_listener_dictionary["ws_event_server_account_creation_failure"] =
    ws_event_server_account_creation_failure.bind( ws );

  /* Chat events */
  event_listener_dictionary["ws_event_server_enter_game"] = ws_event_server_enter_game.bind( ws );
  event_listener_dictionary["event_send_button"] = event_send_button.bind( ws );
  event_listener_dictionary["event_enter_send_message"] = event_enter_send_message.bind( ws );
  event_listener_dictionary["event_start_new_game_button"] = event_start_new_game_button.bind( ws );

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