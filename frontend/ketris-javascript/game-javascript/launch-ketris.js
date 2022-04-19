/*
Launch the Ketris game.
*/
function launchKetris( inIPAddress, inGameID ) {
    //Print some standard information about the game to the console for development purposes.
    console.log( "Connection to server " + inIPAddress + ":3003 for game " + inGameID + "." );
    console.log( "isMobile: " + isMobile );
    console.log( "Launching Ketris." );

    //Launc the Websocket connection to the game server.
    doLaunchWebsocket( inIPAddress, inGameID );
}