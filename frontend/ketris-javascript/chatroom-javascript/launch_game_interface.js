'use strict';

/*
Launch the game interface.
*/
function launchGameInterface( chatroomWebsocket, inIPAddress, inGameID ) {
  //Get references to the interfaces, hide the login/chat interfaces, and show the game interface.
  switchInterface( "game", chatroomWebsocket );

  //Launch the game itself.
  launchKetris( inIPAddress, inGameID );
}