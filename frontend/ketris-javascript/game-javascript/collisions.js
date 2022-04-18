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
  //Iterate through every position in the shape.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ){
      //If that part of the shape has a block, then:
      if( Shapes[inShape][inRotation][x][y] == 1 ) {
        //If the block is at the bottom of the play area, return a collision.
        if( inY+y >= 19 ) { return true; }
        //If the block is going to intersect with an already placed block, return
        //a collision.
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
  //Get the current shape.
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let xOffset = CurrentElement.XPos;
  //Iterate through every position in the shape.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      //If that part of the shape has a block, then:
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        //Check if that block is beyond the right-hand edge of the play area, then
        //return a collision.
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
  //Get the current shape.
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let xOffset = CurrentElement.XPos;
  //Iterate through every position in the shape.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      //If that part of the shape has a block, then:
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        //Check if that block is beyond the left-hand edge of the play area, then
        //return a collision.
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
  //If the next rotation is greater than 3, set the next rotation to 0, because there
  //are only 4 possible rotations, 0 through 3.
  if( inNextRotation > 3 ) { inNextRotation = 0 ; }

  //Get the position of the current element.
  let xOffset = CurrentElement.XPos;
  let Elapsed = Date.now() - CurrentElement.Timestamp;
  let yOffset = Math.floor( Config.Speed*Elapsed )+1;

  //Iterate through every place in the shape.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      //If the place in the shape has a block, and there is a placed block in that
      //position, then return false, prohibiting a rotation.
      if(
        Shapes[inShape][inNextRotation][x][y] == 1 &&
        KetrisGrid[y+yOffset][x+xOffset] != 0
      ) {
        return false;
      }
    }
  }
  //If there hasn't been an blocking collision, return true, allowing a rotation.
  return true;
}


/*
If a rotation will result in a shape going out of the play area, instead move the
rotated shape away from the edge of the play area.
*/
function doProcessWallkicks() {
  //Get the new attempted rotation.
  let newRotation = CurrentElement.Rotation+1;
  if( newRotation > 3) { newRotation = 0; }

  //Iterate through every place in the shape.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      //Move the element to the left as long as it has a block that is beyond the
      //right hand edge of the screen.
      while(
        Shapes[CurrentElement.Shape][newRotation][x][y] == 1 &&
        (x+CurrentElement.XPos) >= 10
      ) {
        CurrentElement.XPos--;
      }
    }
  }

  //Apply the new rotation.
  CurrentElement.Rotation += 1;
  if( CurrentElement.Rotation > 3 ) {
    CurrentElement.Rotation = 0 ;
  }

  //Trigger the creation of a new element.
  doSendNewElement();
}


/*
Check to see if the current shape can be moved to the left.
*/
function isLeftCollidable() {
  //Get current shape information.
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let xOffset = CurrentElement.XPos;
  let Elapsed = Date.now() - CurrentElement.Timestamp;
  let yOffset = Math.floor( Config.Speed*Elapsed )+1;

  //Iterate through every place in the current shape.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      //If there is a block in this part of the current shape:
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        //And if there is a placed block that would intersect with it:
        if( KetrisGrid[y+yOffset][x+xOffset-1] != 0 ) {
          //Return a collision.
          return true;
        }
      }
    }
  }

  //Run the same check as above, but for the current position, rather than the next.
  let ByOffset = Math.round( Config.Speed*Elapsed );
  //Iterate through every place in the current shape.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        if( KetrisGrid[y+ByOffset][x+xOffset-1] == 1 ) {
          return true;
        }
      }
    }
  }

  //If there isn't a collision in the new location, return false.
  return false;
}


/*
Check to see if the current shape can be moved to the right.
*/
function isRightCollidable() {
  //Get current shape information.
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let xOffset = CurrentElement.XPos;
  let Elapsed = Date.now() - CurrentElement.Timestamp;
  let yOffset = Math.floor( Config.Speed*Elapsed ) +1;

  //Iterate through every place in the current shape.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      //If there is a block in this part of the current shape:
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        if( KetrisGrid[y+yOffset][x+xOffset+1] != 0 ) {
          //Return a collision.
          return true;
        }
      }
    }
  }
  
  //Run the same check as above, but for the current position, rather than the next.
  yOffset = Math.round( Config.Speed*Elapsed );
  //Iterate through every place in the current shape.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      //If there is a block in this part of the current shape:
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        if( KetrisGrid[y+yOffset][x+xOffset+1] != 0 ) {
          return true;
        }
      }
    }
  }
  
  //If there isn't a collision in the new location, return false.
  return false;
}


/*
Check to see if there is room in the play area to spawn another shape.
*/
function isShapeSpawnable( inShape, inRotation ) {
  //Iterate through every place in the current shape.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      //If there is a block in this part of the current shape:
      if( Shapes[inShape][inRotation][x][y] == 1 ) {
        //Ensure that there is available space to spawn.
        if( KetrisGrid[y][x+5] != 0 ) {
          //If not, return a collision.
          return false;
        }
      }
    }
  }

  //If there is available space, return no collision.
  return true;
}