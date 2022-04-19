/*
Apply falling status to already placed blocks that no longer have a block beneath
them.

inX: X grid position of block to check.

inY: Y grid position of block to check.
*/
function doGravity( inX, inY ) {
  //Get a timestamp of the present moment.
  let FallingTimestamp = Date.now();

  //Check all grid places above this specified block.
  for( let y=inY; y>0; y-- ) {
    //If there is a block in that grid place:
    if( KetrisGrid[y][inX] != 0 ) {
      //Assign it a falling timestamp
      FallingGrid[y][inX] = FallingTimestamp;

      //Transfer the block's color value to the falling grid.
      FallingColorGrid[y][inX] = KetrisGrid[y][inX];

      //Remove the block from the non-falling grid.
      KetrisGrid[y][inX] = 0;
    }
    //Leave a flag instructing the game that there are enemy blocks falling.
    myGameState.Falling = true;
  }
}


/*
Eliminate a complete line of fallen blocks.

inLineNumber: The line of blocks to delete.
*/
function doLineElimination( inLineNumber ) {
  //Remember the color of the first block in the line.
  let isOneColor = KetrisGrid[inLineNumber][0];

  //Iterate through every grid place in the line.
  for( let x=0; x<10; x++ ) {
    //If one of the blocks is not the same color as the first, remember that.
    if( isOneColor != KetrisGrid[inLineNumber][x] ) {
      isOneColor = -1;
    }

    //Eliminate every block in the line.
    KetrisGrid[inLineNumber][x] = 0;

    //Run gravity on the blocks above the eliminated blocks.
    doGravity( x, inLineNumber );
  }
  //If the eliminated blocks were not one color, add 10 points to score.
  if( isOneColor == -1 ) {
    myGameState.myScore += 10;
  } else { //If the eliminated blocks were one color, add 100 points to score.
    myGameState.myScore += 100;
  }
}


/*
Check for a complete line of fallen blocks.

inLineNumber: The line to check to see if there are a complete line of blocks.
*/
function doCheckLine( inLineNumber ) {
  //Iterate through each grid place in the given line.
  for( let x=0; x<10; x++ ) {
    //If there is not a block in this given grid place:
    if( KetrisGrid[inLineNumber][x] == 0 ) {
      //Return true, indicating that the line is incomplete.
      return true;
    }
  }
  //Otherwise, return false, indicating that the line is complete and that a line
  //elimination should be run on this line.
  return false;
}


/*
Check for a complete line of fallen blocks and eliminate them.
*/
function doCheckForLineElimination() {
  //Remember whether a line has been eliminated or not.
  //Default is set to not.
  let Rerun = false;
  
  //Iterate through every horizontal line in the Ketris grid.
  for( let y=0; y<20; y++ ) {
    //Check to see if there is a complete set of blocks in this line.
    if( doCheckLine( y ) == false ) {
      //If so, remember that this function should be run again.
      Rerun = true;

      //Eliminate the line in question.
      doLineElimination( y );
    }
  }
  
  //In the event that any lines have been eliminated, the game needs to check the
  //grid again for any further lines that need to be eliminated.
  if( Rerun == true ) {
    doCheckForLineElimination();
  }
}


/*
Generate a new shape.
*/
function doGenerateNextElement() {
  //Overwrite the current shape with the values of the next shape.
  CurrentElement.Shape = CurrentElement.NextElement;
  CurrentElement.Color = CurrentElement.NextColor;

  //Randomize the rotation of the new shape.
  CurrentElement.Rotation = Math.floor(Math.random()*4);

  //Ensure that there is space to spawn the new shape.
  if(
    isShapeSpawnable (
      CurrentElement.Shape,
      CurrentElement.Rotation
    ) == false
  ) {
    //If there is not space to spawn the shape, end the game and draw the menu.
    doComposeMenu( 10, 3, 0 );
    DrawMenu = true;
    return;
  }

  //Set the default location and timestamp of the new shape.
  CurrentElement.XPos = 5;
  CurrentElement.YPos = 0;
  CurrentElement.Timestamp = Date.now();
  CurrentElement.LastLevel = 0;

  //Generate the new next element.
  CurrentElement.NextElement = Math.floor(Math.random()*7);
  CurrentElement.NextColor = Math.floor(Math.random()*5)+1;

  //Send the now current, new shape to the enemy.
  doSendNewElement();
}


/*
Take the current element and add it to the fallen blocks.
*/
function doTransposeElement() {
  //Get the information about the current element.
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let Color = CurrentElement.Color;
  let xOffset = Math.floor( CurrentElement.XPos );
  let Elapsed = Date.now() - CurrentElement.Timestamp;
  let yOffset = Math.floor( Math.floor( Config.Speed * Elapsed ) );

  //Iterate through every place in the current shape.
  for( let y=0; y<4; y++ ) {
    for( let x=0; x<4; x++ ) {
      //If there is a block in the given place:
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        //If there is a block already in the place where that block would go:
        if( KetrisGrid[yOffset+y][xOffset+x] != 0 ) {
          //Fail to place the remainder of the shape.
          return false;
        }
        //Otherwise, place this given block into the Ketris grid.
        KetrisGrid[yOffset+y][xOffset+x] = Color;
      }
    }
  }
  //Check to see if any lines need to be eliminated.
  doCheckForLineElimination();

  //Generate the next element.
  doGenerateNextElement();

  //Ensure there are no collisions.
  doCheckForCollision();

  //Return a successful shape placement.
  return true;
}


/*
Function to be called when the player attempts to 'drop' an element, when a player uses
the down arrow key or clicks on the drop area of the player area. This will cause the
current element to stop falling and just be placed where it would fall if it were allowed
to do so over time.
*/
function doElementDrop() {
  //If the game is being played:
  if( myGameState.Falling == false && myGameState.GlobalPlay == true ) {
    //Get the current shape information.
    let Shape = CurrentElement.Shape;
    let Rotation = CurrentElement.Rotation;
    let Color = CurrentElement.Color;
    let xOffset = Math.floor( CurrentElement.XPos );
    let yOffset = Math.floor(
      ( Date.now() -
      CurrentElement.Timestamp ) *
      Config.Speed
    );

    //Check for collisions progressively moving the shape down.
    while( isCollision(
      Shape,
      Rotation,
      xOffset,
      yOffset
    ) == false ) {
      yOffset += 1;
    }

    //Send a collision event to the enemy.
    doSendCollisionEvent( yOffset );

    //Iterate through every place in the shape.
    for( let y=0; y<4; y++ ) {
      for( let x=0; x<4; x++ ) {
        //If there is a block in the current place of the shape:
        if( Shapes[Shape][Rotation][x][y] == 1 ) {
          //If there is a block in the cooresponding ketris grid, fail to place.
          if( KetrisGrid[yOffset+y][xOffset+x] != 0 ) {
            return false;
          }
          //Otherwise, place the block in the Ketris grid.
          KetrisGrid[yOffset+y][xOffset+x] = Color;
        }
      }
    }
    //Check for line elimination (a complete horizontal line to be deleted).
    doCheckForLineElimination();

    //Generate the new element to be used.
    doGenerateNextElement();

    //Ensure that there are no collisions.
    doCheckForCollision();
  }
}


/*
Do logic for blocks that no longer have blocks beneath them.
*/
function doFallingBlocksLogic() {
  let RealPosition;
  let BlocksStillFalling = false;
  //Iterate through the entire Ketris grid of the enemy.
  for( let x=0; x<10; x++ ) {
    for( let y=0; y<20; y++ ) {
      //If there is a falling block in this grid location:
      if( FallingGrid[y][x] != 0 ) {
        //Determine where the block should be drawn.
        RealPosition = (Config.CollapsingSpeed*
          (Date.now()-FallingGrid[y][x]))+y+0.4;

        //Remember that a block is still falling.
        BlocksStillFalling = true;

        //If the block is at the bottom of the play area:
        if( RealPosition+0.6 >= 20 ) {
          //Remove it from the falling grid.
          FallingGrid[y][x] = 0;

          //Add it to the place blocks grid.
          KetrisGrid[19][x] = FallingColorGrid[y][x];

          //Remove the the block from the color falling block grid.
          FallingColorGrid[y][x] = 0;

          //Remember that the block has stopped falling.
          BlocksStillFalling = false;

          //Check to see if line elimination is necessary.
          doCheckForLineElimination();
        } else if( //Or if the falling block is about to collide with another block
          KetrisGrid[Math.round(RealPosition)][x] != 0  ||
          RealPosition+0.6 >= 20
        ) 
          //Remove it from the falling grid.{
          FallingGrid[y][x] = 0;

          //Add it to the place blocks grid, rounding to find the grid position.
          KetrisGrid[Math.floor(RealPosition)][x] =
            FallingColorGrid[y][x];

          //Remove the the block from the color falling block grid.
          FallingColorGrid[y][x] = 0;

          //Remember that the block has stopped falling.
          BlocksStillFalling = false;

          //Check to see if line elimination is necessary.
          doCheckForLineElimination();
        }
      }
    }
  }

  //If blocks are still falling:
  if( BlocksStillFalling == true ) {
    //Remember that they are still falling in the global game state.
    myGameState.Falling = true;
    
    //Set a timestamp to determine where objects should be drawn.
    CurrentElement.Timestamp = Date.now();
  }
  else if( BlocksStillFalling == false ) { //If no blocks are falling:
    //Remember that they are not falling in the global game state.
    myGameState.Falling = false;
  }
}