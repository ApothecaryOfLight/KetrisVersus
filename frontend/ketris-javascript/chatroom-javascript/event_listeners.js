'use strict';

/*
Core functionality
*/
let event_listener_dictionary = {};

function build_event_listener_dictionary( ws ) {
  /* Login events */
  event_listener_dictionary["ws_event_websocket_opened"] =
    ws_event_websocket_opened.bind( ws );
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

function attach_event( DOM_ID, event, function_name ) {
  console.log( "Attaching to object " + DOM_ID + " on " + event + " with " + function_name );
  try {
    if( DOM_ID === "undefined" ) { throw "DOM Element undefined!"; }
    if( event === "undefined" ) { throw "Event undefined!"; }
    if( function_name === "undefined" ) { throw "Function undefined!"; }
    let dom_element_handle = document.getElementById( DOM_ID );
    dom_element_handle.addEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}

function detach_event( DOM_ID, event, function_name ) {
  console.log( "Detaching from object " + DOM_ID + " on " + event + " with " + function_name );
  try {
    if( DOM_ID === "undefined" ) { throw "DOM Element undefined!"; }
    if( event === "undefined" ) { throw "Event undefined!"; }
    if( function_name === "undefined" ) { throw "Function undefined!"; }
    let dom_element_handle = document.getElementById( DOM_ID );
    dom_element_handle.removeEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}

function attach_key_event( DOM_ID, event, key, function_name ) {
  console.log(
    "Attaching keypress to object " + DOM_ID + " on " +
    event + " key " + key + " with " + function_name
  );
  try {
    if( DOM_ID === "undefined" ) { throw "DOM Element undefined!"; }
    if( event === "undefined" ) { throw "Event undefined!"; }
    if( function_name === "undefined" ) { throw "Function undefined!"; }
    if( key === "undefined" ) { throw "Key undefined!"; }
    let dom_element_handle = document.getElementById( DOM_ID );
    dom_element_handle.addEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}

function detach_key_event( DOM_ID, event, key, function_name ) {
  console.log(
    "Detaching keypress from object " + DOM_ID + " on " +
    event + " key " + key + " with " + function_name
  );
  try {
    if( DOM_ID === "undefined" ) { throw "DOM Element undefined!"; }
    if( event === "undefined" ) { throw "Event undefined!"; }
    if( function_name === "undefined" ) { throw "Function undefined!"; }
    if( key === "undefined" ) { throw "Key undefined!"; }
    let dom_element_handle = document.getElementById( DOM_ID );
    dom_element_handle.removeEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}

function attach_ws_event( ws, event, function_name ) {
  console.log( "Attaching to websocket event on " + event + " with " + function_name );
  try {
    if( ws === "undefined" ) { throw "Websocket undefined!"; }
    if( event === "undefined" ) { throw "Event undefined!"; }
    if( function_name === "undefined" ) { throw "Function undefined!"; }
    ws.addEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}

function detach_ws_event( ws, event, function_name ) {
  console.log( "Detaching from websocket event on " + event + " with " + function_name );
  try {
    if( ws === "undefined" ) { throw "Websocket undefined!"; }
    if( event === "undefined" ) { throw "Event undefined!"; }
    if( function_name === "undefined" ) { throw "Function undefined!"; }
    ws.removeEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}