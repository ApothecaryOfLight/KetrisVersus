'use strict';

/*
Game interface
*/
function launchGameInterface( inIPAddress, inGameID ) {
    console.log( "Launching game interface!" );
    let login_interface = document.getElementById('login_interface');
    let chat_interface = document.getElementById('chat_interface');
    let game_interface = document.getElementById('game_interface');
    login_interface.style.display = "none";
    chat_interface.style.display = "none";
    game_interface.style.display = "flex";
    launchKetris( inIPAddress, inGameID );
  }

  function launch_GameInterface() {

  }
  
  function cleanup_GameInterface() {
  
  }