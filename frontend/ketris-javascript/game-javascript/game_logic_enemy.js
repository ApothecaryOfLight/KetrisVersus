/*
Apply falling status to already placed blocks that no longer have a block beneath
them.

inX: X grid position of block to check.

inY: Y grid position of block to check.
*/
function doGravity_Enemy( inX, inY ) {
  //Get a timestamp of the present moment.
  let FallingTimestamp = Date.now();

  //Check all grid places above this specified block.
  for( let y=inY; y>0; y-- ) {
    //If there is a block in that grid place:
    if( KetrisGrid_Enemy[y][inX] != 0 ) {
      //Assign it a falling timestamp
      FallingGrid_Enemy[y][inX] = FallingTimestamp;

      //Transfer the block's color value to the falling grid.
      FallingColorGrid_Enemy[y][inX] = KetrisGrid_Enemy[y][inX];

      //Remove the block from the non-falling grid.
      KetrisGrid_Enemy[y][inX] = 0;
    }
    //Leave a flag instructing the game that there are enemy blocks falling.
    myGameState.Falling_Enemy = true;
  }
}


/*
Eliminate a complete line of fallen blocks.

inLineNumber: The line of blocks to delete.
*/
function doLineElimination_Enemy( inLineNumber ) {
  //Iterate through every grid place in the line.
  for( let x=0; x<10; x++ ) {
    //Delete each block in the line.
    KetrisGrid_Enemy[inLineNumber][x] = 0;

    //Run a gravity check for the blocks above each of these grid places.
    doGravity_Enemy( x, inLineNumber );
  }
}


/*
Check for a complete line of fallen blocks.

inLineNumber: The line to check to see if there are a complete line of blocks.
*/
function doCheckLine_Enemy( inLineNumber ) {
  //Iterate through each grid place in the given line.
  for( let x=0; x<10; x++ ) {
    //If there is not a block in this given grid place:
    if( KetrisGrid_Enemy[inLineNumber][x] == 0 ) {
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
function doCheckForLineElimination_Enemy() {
  //Remember whether a line has been eliminated or not.
  //Default is set to not.
  let Rerun_Enemy = false;

  //Iterate through every horizontal line in the Ketris grid.
  for( let y=0; y<20; y++ ) {
    //Check to see if there is a complete set of blocks in this line.
    if( doCheckLine_Enemy( y ) == false ) {
      //If so, remember that this function should be run again.
      Rerun_Enemy = true;

      //Eliminate the line in question.
      doLineElimination_Enemy( y );
    }
  }

  //In the event that any lines have been eliminated, the game needs to check the
  //grid again for any further lines that need to be eliminated.
  if( Rerun_Enemy == true ) {
    doCheckForLineElimination_Enemy();
  }
}


/*
Take the enemy's current element and add it to the placed blocks.
*/
function doTransposeElement_Enemy() {
  //Get the information about the current element.
  let Shape = CurrentElement_Enemy.Shape;
  let Rotation = CurrentElement_Enemy.Rotation;
  let Color = CurrentElement_Enemy.Color;
  let xOffset = Math.floor( CurrentElement_Enemy.XPos );
  let yOffset = CurrentElement_Enemy.YPos;

  //Iterate through every place in the current shape.
  for( let y=0; y<4; y++ ) {
    for( let x=0; x<4; x++ ) {
      //If there is a block in the given place:
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        //If there is a block already in the place where that block would go:
        if( KetrisGrid_Enemy[yOffset+y][xOffset+x] != 0 ) {
          //Fail to place the remainder of the shape.
          return false;
        }
        //Otherwise, place this given block into the Ketris grid.
        KetrisGrid_Enemy[yOffset+y][xOffset+x] = Color;
      }
    }
  }
  //Check to see if any lines need to be eliminated.
  doCheckForLineElimination_Enemy();

  //Return a successful shape placement.
  return true;
}


/*
Do logic for blocks that no longer have blocks beneath them.
*/
function doFallingBlocksLogic_Enemy() {
  let RealPosition_Enemy;
  let BlocksStillFalling_Enemy = false;
  //Iterate through the entire Ketris grid of the enemy.
  for( let x=0; x<10; x++ ) {
    for( let y=0; y<20; y++ ) {
      //If there is a falling block in this grid location:
      if( FallingGrid_Enemy[y][x] != 0 ) {
        //Determine where the block should be drawn.
        RealPosition_Enemy = (Config.CollapsingSpeed*
          (Date.now()-FallingGrid_Enemy[y][x]))+y+0.4;

        //Remember that a block is still falling.
        BlocksStillFalling_Enemy = true;

        //If the block is at the bottom of the play area:
        if( RealPosition_Enemy+0.6 >= 20 ) {
          //Remove it from the falling grid.
          FallingGrid_Enemy[y][x] = 0;

          //Add it to the place blocks grid.
          KetrisGrid_Enemy[19][x] = FallingColorGrid_Enemy[y][x];

          //Remove the the block from the color falling block grid.
          FallingColorGrid_Enemy[y][x] = 0;

          //Remember that the block has stopped falling.
          BlocksStillFalling_Enemy = false;

          //Check to see if line elimination is necessary.
          doCheckForLineElimination_Enemy();
        } else if( //Or if the falling block is about to collide with another block
          KetrisGrid_Enemy[Math.round(RealPosition_Enemy)][x] != 0  ||
          RealPosition_Enemy+0.6 >= 20
          )
        {
          //Remove it from the falling grid.
          FallingGrid_Enemy[y][x] = 0;

          //Add it to the place blocks grid, rounding to find the grid position.
          KetrisGrid_Enemy[Math.floor(RealPosition_Enemy)][x] =
            FallingColorGrid_Enemy[y][x];

          //Remove the the block from the color falling block grid.
          FallingColorGrid_Enemy[y][x] = 0;

          //Remember that the block has stopped falling.
          BlocksStillFalling_Enemy = false;

          //Check to see if line elimination is necessary.
          doCheckForLineElimination_Enemy();
        }
      }
    }
  }

  //If blocks are still falling:
  if( BlocksStillFalling_Enemy == true ) {
    //Remember that they are still falling in the global game state.
    myGameState.Falling_Enemy = true;

    //Set a timestamp to determine where objects should be drawn.
    CurrentElement_Enemy.Timestamp = Date.now();
  }
  else if( BlocksStillFalling_Enemy == false ) { //If no blocks are falling:
    //Remember that they are not falling in the global game state.
    myGameState.Falling_Enemy = false;
  }
}