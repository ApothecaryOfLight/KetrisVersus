/*
Send a move left event.
*/
function doSendMovementLeft() {
  if( myGameState.GlobalPlay == true ) {
    let doMoveElementLeft = JSON.stringify({
      type: "game_event",
      event: "client_movement",
      direction: "left"
    });
    connection.send( doMoveElementLeft );
  }
}


/*
Send a move right event.
*/
function doSendMovementRight() {
  if( myGameState.GlobalPlay == true ) {
    let doMoveElementRight = JSON.stringify({
      type: "game_event",
      event: "client_movement",
      direction: "right"
    });
    connection.send( doMoveElementRight );
  }
}


/*
Send a rotation event.
*/
function doSendRotation( inRotation ) {
  if( myGameState.GlobalPlay == true ) {
    let newRotation = JSON.stringify({
      type: "game_event",
      event: "client_rotation",
      rotation: inRotation
    });
    connection.send( newRotation );
  }
}


/*
Send a collision event.
*/
function doSendCollisionEvent( inYOffset ) {
  if( myGameState.GlobalPlay == true ) {
    let newElementCollision = JSON.stringify({
      type: "game_event",
      event: "client_collision",
      Shape: CurrentElement.Shape,
      Rotation: CurrentElement.Rotation,
      Color: CurrentElement.Color,
      Timestamp: CurrentElement.Timtamp,
      XPos: CurrentElement.XPos,
      YPos: (CurrentElement.YPos+inYOffset)
    });
    connection.send( newElementCollision );
  }
}


/*
Send a new shape event..
*/
function doSendNewElement() {
  let newElementOut = JSON.stringify({
    type: "game_event",
    event: "client_new_shape",
    Shape: CurrentElement.Shape,
    Rotation: CurrentElement.Rotation,
    Color: CurrentElement.Color,
    Timestamp: CurrentElement.Timestamp,
    XPos: CurrentElement.XPos,
    YPos: CurrentElement.YPos
  });
  connection.send( newElementOut );
}