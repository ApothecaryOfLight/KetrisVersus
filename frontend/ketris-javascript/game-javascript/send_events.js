function doSendMovementLeft() {
    if( myGameState.GlobalPlay == true ) {
      //console.log( "Do sending move left event." );
      let doMoveElementLeft = JSON.stringify({
        type: "game_event",
        event: "client_movement",
        direction: "left"
      });
      connection.send( doMoveElementLeft );
    }
  }

  function doSendMovementRight() {
    if( myGameState.GlobalPlay == true ) {
      //console.log( "Do sending move right event." );
      let doMoveElementRight = JSON.stringify({
        type: "game_event",
        event: "client_movement",
        direction: "right"
      });
      connection.send( doMoveElementRight );
    }
  }

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

  function doSendCollisionEvent( inYOffset ) {
    console.log( "doSendCollisionEvent" );
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