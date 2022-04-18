/*
Check for collisions.
*/
function doCheckForCollision() {
  //Get information about the active (falling) element.
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let xOffset = Math.floor( CurrentElement.XPos );
  let Elapsed = Date.now() - CurrentElement.Timestamp;
  let yOffset = Math.floor( (Config.Speed)*Elapsed );

  //Iterate over each block in the current shape.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      //Test for a block in this space for this shape.
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        //Check to see if this shape has reached the bottom of the gameplay area.
        if( ( yOffset + y ) >= 19 ) {
          doSendCollisionEvent( yOffset );
          doTransposeElement();
          return;
        }
        //Check to see if the play area has a block in this space.
        if( KetrisGrid[yOffset+y+1][xOffset+x] != 0 ) {
          //Send a collision event to the server.
          doSendCollisionEvent( yOffset );
          //Check to see if this shape can't be placed (ie the play-area is full).
          if( doTransposeElement() == false ) {
            //End the game locally.
            myGameState.GlobalPlay = false;
            myGameState.GameOver = true;

            //Send a message to the server ending the game.
            let end_game = JSON.stringify({
              type: 'game_event',
              event: 'client_end_game'
            });
            connection.send( end_game );

            //Draw the end of game menu.
            doComposeMenu( 10, 3, 0 );
            DrawMenu = true;
          }
          return;
        }
      }
    }
  }
  return;
}


/*
Check for a collision of the given shape.

inShape: The current shape.

inRotation: The rotation value of the current shape.

inX: The x position of the current shape.

inY: The y position of the current shape.
*/
function isCollision( inShape, inRotation, inX, inY ) {
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ){
      if( Shapes[inShape][inRotation][x][y] == 1 ) {
        if( inY+y >= 19 ) { return true; }
        if( KetrisGrid[inY+y+1][inX+x] != 0 ) {
          return true;
        }
      }
    }
  }
  return false;
}


/*
Check for a collision of the current shape to the right.
*/
function isCurrentObjectOnScreenRightHand() {
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let xOffset = CurrentElement.XPos;
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        if( xOffset+x > 8 ) { return false; }
      }
    }
  }
  return true;
}


/*
Check for a collision of the current shape to the left.
*/
function isCurrentObjectOnScreenLeftHand() {
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let xOffset = CurrentElement.XPos;
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        if( xOffset+x < 1 ) { return false; }
      }
    }
  }
  return true;
}


/*
Check for a see if rotation is allowed, that is to say ensure that a rotation will not
result in the shape going out of the play area.
*/
function isRotationAllowed( inShape, inCurrentRotation, inNextRotation, inX, inY ) {
  if( inNextRotation > 3 ) { inNextRotation = 0 ; }
  let xOffset = CurrentElement.XPos;
  let Elapsed = Date.now() - CurrentElement.Timestamp;
  let yOffset = Math.floor( Config.Speed*Elapsed )+1;

  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      if(
        Shapes[inShape][inNextRotation][x][y] == 1 &&
        KetrisGrid[y+yOffset][x+xOffset] != 0
      ) {
        return false;
      }
    }
  }
  return true;
}


/*
If a rotation will result in a shape going out of the play area, instead move the
rotated shape away from the edge of the play area.
*/
function doProcessWallkicks() {
  let newRotation = CurrentElement.Rotation+1;
  if( newRotation > 3) { newRotation = 0; }

  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      while(
        Shapes[CurrentElement.Shape][newRotation][x][y] == 1 &&
        (x+CurrentElement.XPos) >= 10
      ) {
        CurrentElement.XPos--;
      }
    }
  }
  CurrentElement.Rotation += 1;
  if( CurrentElement.Rotation > 3 ) {
    CurrentElement.Rotation = 0 ;
  }
  doSendNewElement();
}


/*
Check to see if the current shape can be moved to the left.
*/
function isLeftCollidable() {
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let xOffset = CurrentElement.XPos;
  let Elapsed = Date.now() -
  CurrentElement.Timestamp;
  let yOffset = Math.floor( Config.Speed*Elapsed )+1;
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        if( KetrisGrid[y+yOffset][x+xOffset-1] != 0 ) {
          return true;
        }
      }
    }
  }
  let ByOffset = Math.round( Config.Speed*Elapsed );
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        if( KetrisGrid[y+ByOffset][x+xOffset-1] == 1 ) {
          return true;
        }
      }
    }
  }
  return false;
}


/*
Check to see if the current shape can be moved to the right.
*/
function isRightCollidable() {
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let xOffset = CurrentElement.XPos;
  let Elapsed = Date.now() - CurrentElement.Timestamp;
  let yOffset = Math.floor( Config.Speed*Elapsed ) +1;
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        if( KetrisGrid[y+yOffset][x+xOffset+1] != 0 ) {
          return true;
        }
      }
    }
  }
  yOffset = Math.round( Config.Speed*Elapsed );
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        if( KetrisGrid[y+yOffset][x+xOffset+1] != 0 ) {
          return true;
        }
      }
    }
  }
  return false;
}


/*
Check to see if there is room in the play area to spawn another shape.
*/
function isShapeSpawnable( inShape, inRotation ) {
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      if( Shapes[inShape][inRotation][x][y] == 1 ) {
        if( KetrisGrid[y][x+5] != 0 ) {
          return false;
        }
      }
    }
  }
  return true;
}