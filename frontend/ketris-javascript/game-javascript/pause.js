function doReceivePause() {
    console.log( "doReceivePause()" );
    doPause();
  }
  function doReceiveUnpause() {
    console.log( "doReceiveUnpause()" );
    doUnpause();
  }
  function doReceiveHidden() {
    console.log( "doReceiveHidden()" );
    myGameState.enemy_visibility = false;
    doPause();
  }
  function doReceiveVisible() {
    console.log( "doReceiveVisible()" );
    myGameState.enemy_visibility = true;
    doUnpause();
  }

  function doSendPause() {
    console.log( "doSendPause()" );
    let pause = JSON.stringify({
      type: 'game_event',
      event: 'client_pause'
    });
    connection.send( pause );
  }
  function doSendUnpause() {
    console.log( "doSendUnpause" );
    let unpause = JSON.stringify({
      type: 'game_event',
      event: 'client_unpause'
    });
    connection.send( unpause );
  }
  function doSendVisible() {
    console.log( "doSendVisible." );
    connection.send( JSON.stringify({
      type: "game_event",
      event: "client_visible"
    }));
  }
  function doSendHidden() {
    console.log( "doSendHidden." );
    connection.send( JSON.stringify({
      type: "game_event",
      event: "client_hidden"
    }));
  }

  function doPause( inEventType ) {
    console.log( "doPause()" );
    if( myGameState.Paused == false ) {
      console.log( "Pausing." );
      myGameState.PausedTimestamp = Date.now();
      myGameState.Paused = true;
    } else {
      console.log( "Already paused." );
    }
  }
  function doUnpause( inEventType ) {
    console.log( "doUnpause()" );
    if( myGameState.Paused == false ) {
      console.log( "Already unpaused." );
      return;
    }
    if( !areBothVisible() ) {
      console.log( "Someone is minimized/on another tab." );
      return;
    }
    console.log( "Successfully unpaused @: " + myGameState.PausedTimestamp );
    console.log( "Was paused for " + (Date.now()-myGameState.PausedTimestamp) );
    myGameState.Paused = false;
    CurrentElement.Timestamp += Date.now()-myGameState.PausedTimestamp;
    CurrentElement_Enemy.Timestamp += Date.now()-myGameState.PausedTimestamp
    //myAnimationValues.AnimationFrameHandle = window.requestAnimationFrame( doManageDrawing );
  }
  function on_visibility_change() {
    console.log( "Docuemnt visibility change: " + document.visibilityState );
    if( document.visibilityState == "hidden" ) {
      cancelAnimationFrame( myAnimationValues.AnimationFrameHandle );
      doSendHidden();
      doPause();
      doSendPause();
    } else if( document.visibilityState == "visible" ) {
      myAnimationValues.AnimationFrameHandle =
        window.requestAnimationFrame( doManageDrawing, myAnimationValues.AnimationFrameHandle );
      doSendVisible();
      doUnpause();
      doSendUnpause();
    }
  }
  
  function areBothVisible() {
    console.log( "Checking visibility: " );
    console.log( "enemy_visibility:" + myGameState.enemy_visibility );
    console.log( "doc: " + document.visibilityState );
    let booleanTest = myGameState.enemy_visibility && document.visiblityState=="visible";
    console.log( "boolean: " + booleanTest );
    return( myGameState.enemy_visibility && document.visibilityState=="visible" );
  }