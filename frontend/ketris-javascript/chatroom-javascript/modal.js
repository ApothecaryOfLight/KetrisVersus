'use strict';

/*
Modal Interface
*/
function launch_modal( title, message, buttons ) {
    const modal_interface = document.getElementById("modal_overlay");
    const modal_title = document.getElementById("modal_title");
    const modal_content = document.getElementById("modal_content");
    const modal_buttons = document.getElementById("modal_buttons");
  
    modal_interface.style.display = "flex";
    modal_title.innerHTML = title;
    modal_content.innerHTML = message;
  
    let buttons_div = "";
    buttons.forEach( button => {
      buttons_div += "<button class='button_class' onclick=" +
        button.func + ">" +
        button.text + "</button>";
    });
    console.log( buttons_div );
    modal_buttons.innerHTML = buttons_div;
  }
  
  function close_modal() {
    const modal_interface = document.getElementById("modal_overlay");
    modal_interface.style.display = "none";
  }