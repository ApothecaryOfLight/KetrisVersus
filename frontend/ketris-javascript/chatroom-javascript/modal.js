'use strict';

/*
Launch the modal popup.
*/
function launch_modal( title, message, buttons ) {
  //Get references to the modal popup.
  const modal_interface = document.getElementById("modal_overlay");
  const modal_title = document.getElementById("modal_title");
  const modal_content = document.getElementById("modal_content");
  const modal_buttons = document.getElementById("modal_buttons");

  //Show the modal popup and assign the title and message text values to it.
  modal_interface.style.display = "flex";
  modal_title.innerHTML = title;
  modal_content.innerHTML = message;

  //Iterate through the buttons object provided and create a button for each.
  let buttons_div = "";
  buttons.forEach( button => {
    buttons_div += "<button class='button_class' onclick=" +
    button.func + ">" +
    button.text + "</button>";
  });
  //Assign the string-bashed buttons div to the modal popup.
  modal_buttons.innerHTML = buttons_div;
}


/*
Close the modal popup.
*/
function close_modal() {
  const modal_interface = document.getElementById("modal_overlay");
  modal_interface.style.display = "none";
}