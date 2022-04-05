function launchKetris( inIPAddress, inGameID ) {
  console.log( "Connection to server " + inIPAddress + ":3003 for game " + inGameID + "." );
  console.log( "isMobile: " + isMobile );
  console.log( "Launching Ketris." );
  
  doLaunchWebsocket( inIPAddress, inGameID );


  /*setInterval( function() {*/
    //console.log( "setInterval" );
    /*if( connection.readyState !== 1 ) {*/
      /*myDOMHandles.input.attr( 'disabled', 'disabled' ).val(
        'Unable to communicate with the server.'
      );*/
    //}
  /*}, 3000 );*/
}
