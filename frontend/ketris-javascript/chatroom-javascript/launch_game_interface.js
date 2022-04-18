'use strict';

/*
Launch the game interface.
*/
function launchGameInterface( inIPAddress, inGameID ) {
  //Get references to the interfaces, hide the login/chat interfaces, and show the game interface.
  let login_interface = document.getElementById('login_interface');
  let chat_interface = document.getElementById('chat_interface');
  let game_interface = document.getElementById('game_interface');
  login_interface.style.display = "none";
  chat_interface.style.display = "none";
  game_interface.style.display = "flex";

  //Launch the game itself.
  launchKetris( inIPAddress, inGameID );
}