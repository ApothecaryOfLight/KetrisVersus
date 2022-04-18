/*
Function to be called upon receiving a pause event.
*/
function doReceivePause() {
  doPause();
}


/*
Function to be called upon receiving an unpause event.
*/
function doReceiveUnpause() {
  doUnpause();
}


/*
Function to be called upon receiving an event from the other user that their interface
is no longer active.
*/
function doReceiveHidden() {
  myGameState.enemy_visibility = false;
  doPause();
}


/*
Function to be called upon receiving an event from the other use that their interface
is now active.
*/
function doReceiveVisible() {
  myGameState.enemy_visibility = true;
  doUnpause();
}


/*
Send an event to the other player that the user has paused the game.
*/
function doSendPause() {
  let pause = JSON.stringify({
    type: 'game_event',
    event: 'client_pause'
  });
  connection.send( pause );
}


/*
Send an event to the other player that the user has unpaused the game.
*/
function doSendUnpause() {
  let unpause = JSON.stringify({
    type: 'game_event',
    event: 'client_unpause'
  });
  connection.send( unpause );
}


/*
Send an event to the other player that the user's interface is active.
*/
function doSendVisible() {
  connection.send( JSON.stringify({
    type: "game_event",
    event: "client_visible"
  }));
}


/*
Send an event to the other player that the user's interface is hideen.
*/
function doSendHidden() {
  connection.send( JSON.stringify({
    type: "game_event",
    event: "client_hidden"
  }));
}


/*
Function to be triggered on a pause event.
*/
function doPause( inEventType ) {
  if( myGameState.Paused == false ) {
    myGameState.PausedTimestamp = Date.now();
    myGameState.Paused = true;
  } else {
  }
}


/*
Function to be triggered upon an unpause event.
*/
function doUnpause( inEventType ) {
  if( myGameState.Paused == false ) {
    return;
  }
  if( !areBothVisible() ) {
    return;
  }
  myGameState.Paused = false;
  CurrentElement.Timestamp += Date.now()-myGameState.PausedTimestamp;
  CurrentElement_Enemy.Timestamp += Date.now()-myGameState.PausedTimestamp
}


/*
Function to be called on the visibilityState chanve event.
*/
function on_visibility_change() {
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


/*
Function to test if both this user and the enemy both have visible interfaces.
*/
function areBothVisible() {
  let booleanTest = myGameState.enemy_visibility && document.visiblityState=="visible";
  return( myGameState.enemy_visibility && document.visibilityState=="visible" );
}