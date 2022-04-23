'use strict';


/*
Launch the contact dev popup modal.
*/
function event_launch_contact_dev_popup( event ) {
  //Get a reference to the contact dev popup modal.
  let contact_dev_popup_overlay = document.getElementById('contact_dev_popup_overlay');

  //Set the display of the contact dev popup modal to be displayed under flex.
  contact_dev_popup_overlay.style.display = "flex";
}


/*
Close the contac dev popup modal.
*/
function event_close_contact_dev_popup( event ) {
  //Get a reference to the contact dev popup modal.
  let contact_dev_popup_exit_button = document.getElementById('contact_dev_popup_exit_button');

  //Set the display of the contact dev popup modal to be hidden.
  contact_dev_popup_overlay.style.display = "none";
}


/*
Send the contact dev form to the server.
*/
function event_send_contact_dev_message( event ) {
  //Get references to the text fields of the form.
  let contact_dev_popup_nameorg_field = document.getElementById('contact_dev_popup_nameorg_field');
  let contact_dev_popup_message_field = document.getElementById('contact_dev_popup_message_field');

  //Get the text values stored in the text fields.
  const author = contact_dev_popup_nameorg_field.value;
  const message = contact_dev_popup_message_field.value;

  //Attempt to send those text fields to the server.
  if( doSendMessageToDev( this, author, message ) ) {
    //If the sent succeeded, then blank the text fields.
    contact_dev_popup_nameorg_field.value = "";
    contact_dev_popup_message_field.value = "";

    //Hide the contact dev poupup.
    contact_dev_popup_overlay.style.display = "none";
  }
}


/*
Send the form contents from the contact dev popup modal to the server.
*/
function doSendMessageToDev( ws, inAuthor, inMessage ) {
  //If the author or message fields are blank, refuse to send the message.
  if( inAuthor == "" || inMessage == "" ) {
    //Launch a popup informing the user why the send failed.
    launch_modal(
      "Contact Dev Failed!", //Title of the modal.
      "You must supply both an author and message.", //Message of the modal.
      [{
        text: "Close", //Text of the button.
        func: "close_modal()" //Function to be attached to the button.
      }] //Button for the modal.
    );
    return false;
  }

  //Send the message to the server as a JSON object.
  ws.send( JSON.stringify({
    event: "client_dev_message",
    author: inAuthor,
    message: inMessage
  }));
  return true;
}