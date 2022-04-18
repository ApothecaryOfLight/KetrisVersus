/*
Launch the Ketris game.
*/
function launchKetris( inIPAddress, inGameID ) {
    console.log( "Connection to server " + inIPAddress + ":3003 for game " + inGameID + "." );
    console.log( "isMobile: " + isMobile );
    console.log( "Launching Ketris." );

    doLaunchWebsocket( inIPAddress, inGameID );
}