'use strict';

/*
Chat interface Contact dev events
*/
function event_launch_contact_dev_popup( event ) {
    console.log( "event_launch_contact_dev_popup" );
  
    let contact_dev_popup_overlay = document.getElementById('contact_dev_popup_overlay');
    contact_dev_popup_overlay.style.display = "flex";
  }
  
  function event_close_contact_dev_popup( event ) {
    console.log( "event_close_contact_dev_popup" );
  
    let contact_dev_popup_exit_button = document.getElementById('contact_dev_popup_exit_button');
    contact_dev_popup_overlay.style.display = "none";
  }
  
  function event_send_contact_dev_message( event ) {
    console.log( "event_send_contact_dev_message" );
  
    let contact_dev_popup_nameorg_field = document.getElementById('contact_dev_popup_nameorg_field');
    let contact_dev_popup_message_field = document.getElementById('contact_dev_popup_message_field');
    const author = contact_dev_popup_nameorg_field.value;
    const message = contact_dev_popup_message_field.value;
    doSendMessageToDev( this, author, message );
    contact_dev_popup_nameorg_field = "";
    contact_dev_popup_message_field = "";
    contact_dev_popup_overlay.style.display = "none";
  }

  function doShowContactDevPopup( event ) {
  
  }
  
  function doHideContactDevPopup( event ) {
    
  }
  
  function doSendMessageToDev( ws, inAuthor, inMessage ) {
    console.log( "Sending..." + inAuthor + "/" + inMessage );
    if( inAuthor == "" || inMessage == "" ) {
      console.log( "Please fill out both fields" );
      return;
    }
    ws.send( JSON.stringify({
      event: "client_dev_message",
      author: inAuthor,
      message: inMessage
    }));
  }