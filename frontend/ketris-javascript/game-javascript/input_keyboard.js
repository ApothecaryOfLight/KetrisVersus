//////////////////////////////////////////////////////////////////////////
//  Input Functions  /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
function doLeftKeyPress() {
    if(
      isCurrentObjectOnScreenLeftHand() == true &&
      isLeftCollidable() == false
    ) {
      CurrentElement.XPos -= 1;
      doSendMovementLeft();
      doCheckForCollision();
    }
  }
  function doRightKeyPress() {
    if(
      isCurrentObjectOnScreenRightHand() == true &&
      isRightCollidable() == false
    ) {
      CurrentElement.XPos += 1;
      doSendMovementRight();
      doCheckForCollision();
    }
  }
  function doUpKeyPress() {
    if( isRotationAllowed( 
      CurrentElement.Shape,
      CurrentElement.Rotation,
      CurrentElement.Rotation+1,
      CurrentElement.XPos,
      CurrentElement.YPos
    ) == true )
    {
      CurrentElement.Rotation += 1;
      if( CurrentElement.Rotation > 3 ) {
        CurrentElement.Rotation = 0 ;
      }
      doSendRotation( CurrentElement.Rotation );
    } else if( CurrentElement.XPos >= 8 ) {
      doProcessWallkicks();
    }
  }
  function doDownKeyPress() {
    doElementDrop();
  }

  function doSpaceKeyPress() {
    console.log( "Space pressed." );
    if( myGameState.Paused == false ) {
      doPause( "key" );
      doSendPause();
    }
    else {
      doUnpause( "key" );
      doSendUnpause();
    }
  }


  function doEscapeKeyPress () {
  }
  document.onkeydown = function(event) {
    if( myGameState.GlobalPlay == true ) {
      if( myGameState.Paused == false ) {
        if( event.which==37 ) { doLeftKeyPress(); }
        if( event.which==39 ) { doRightKeyPress(); }
        if( event.which==38 ) { doUpKeyPress(); }
        if( event.which==40 ) { doDownKeyPress(); }
      }
      if( event.which==27 ) { doEscapeKeyPress(); }
    }
  }
  document.onkeypress = function(event) {
    if( myGameState.GlobalPlay == true ) {
      if( event.which==32 ) { 
        event.stopPropagation();
        event.preventDefault();
        if( myGameState.GameOver == false ) { doSpaceKeyPress(); }
      }
      if( myGameState.Paused == false ) {
        if( event.which==49 || event.which==97 ) {
          doLeftKeyPress();
        }
        if( event.which==51 || event.which==100 ) {
          doRightKeyPress();
        }
        if( event.which==53 || event.which==119 ) {
          doUpKeyPress();
        }
        if( event.which==50 || event.which==115 ) {
          doDownKeyPress();
        }
      }
    }
  }