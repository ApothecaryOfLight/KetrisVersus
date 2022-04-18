/*
Calculate the position of the other user's current shape.
*/
function doGravity( inX, inY ) {
  let FallingTimestamp = Date.now();
  for( let y=inY; y>0; y-- ) {
    if( KetrisGrid[y][inX] != 0 ) {
      FallingGrid[y][inX] = FallingTimestamp;
      FallingColorGrid[y][inX] = KetrisGrid[y][inX];
      KetrisGrid[y][inX] = 0;
    }
    myGameState.Falling = true;
  }
}


/*
Eliminate a complete line of fallen blocks.
*/
function doLineElimination( inLineNumber ) {
  let isOneColor = KetrisGrid[inLineNumber][0];
  for( let x=0; x<10; x++ ) {
    if( isOneColor != KetrisGrid[inLineNumber][x] ) {
      isOneColor = -1;
    }
    KetrisGrid[inLineNumber][x] = 0;
    doGravity( x, inLineNumber );
  }
  if( isOneColor == -1 ) {
    myGameState.myScore += 10;
  } else {
    myGameState.myScore += 100;
  }
}


/*
Check for a complete line of fallen blocks.
*/
function doCheckLine( inLineNumber ) {
  for( let x=0; x<10; x++ ) {
    if( KetrisGrid[inLineNumber][x] == 0 ) {
      return true;
    }
  }
  return false;
}


/*
Check for a complete line of fallen blocks and eliminate them.
*/
function doCheckForLineElimination() { //TODO: Implement multiline wins
  let Rerun = false;
  for( let y=0; y<20; y++ ) {
    if( doCheckLine( y ) == false ) {
      Rerun = true;
      doLineElimination( y );
    }
  }  //TODO: Implement patterns
  if( Rerun == true ) {
    doCheckForLineElimination();
  }
}


/*
Generate a new shape.
*/
function doGenerateNextElement() {
  CurrentElement.Shape = CurrentElement.NextElement;
  CurrentElement.Color = CurrentElement.NextColor;
  CurrentElement.Rotation = Math.floor(Math.random()*4);

  if( isShapeSpawnable (
    CurrentElement.Shape,
    CurrentElement.Rotation
  ) == false ) {
    doComposeMenu( 10, 3, 0 );
    DrawMenu = true;
    return;
  }
  CurrentElement.XPos = 5;
  CurrentElement.YPos = 0;
  CurrentElement.Timestamp = Date.now();
  CurrentElement.LastLevel = 0;
  CurrentElement.NextElement = Math.floor(Math.random()*7);
  CurrentElement.NextColor = Math.floor(Math.random()*5)+1;
  doSendNewElement();
}


/*
Take the current element and add it to the fallen blocks.
*/
function doTransposeElement() {
  console.log( "doTransposeElement" );
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let Color = CurrentElement.Color;

  let xOffset = Math.floor( CurrentElement.XPos );

  let Elapsed = Date.now() -
    CurrentElement.Timestamp;
  let yOffset = Math.floor( Math.floor( Config.Speed * Elapsed ) );

  for( let y=0; y<4; y++ ) {
    for( let x=0; x<4; x++ ) {
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        if( KetrisGrid[yOffset+y][xOffset+x] != 0 ) {
          return false;
        }
        KetrisGrid[yOffset+y][xOffset+x] = Color;
      }
    }
  }
  doCheckForLineElimination();
  doGenerateNextElement();
  doCheckForCollision();
  return true;
}


/*
Function to be called when the player attempts to 'drop' an element, when a player uses
the down arrow key or clicks on the drop area of the player area. This will cause the
current element to stop falling and just be placed where it would fall if it were allowed
to do so over time.
*/
function doElementDrop() {
  if( myGameState.Falling == false && myGameState.GlobalPlay == true ) {
    let Shape = CurrentElement.Shape;
    let Rotation = CurrentElement.Rotation;
    let Color = CurrentElement.Color;
    let xOffset = Math.floor( CurrentElement.XPos );
    let yOffset = Math.floor(
      ( Date.now() -
      CurrentElement.Timestamp ) *
      Config.Speed
    );

    while( isCollision(
      Shape,
      Rotation,
      xOffset,
      yOffset
    ) == false ) {
      yOffset += 1;
    }
    doSendCollisionEvent( yOffset );
    for( let y=0; y<4; y++ ) {
      for( let x=0; x<4; x++ ) {
        if( Shapes[Shape][Rotation][x][y] == 1 ) {
          if( KetrisGrid[yOffset+y][xOffset+x] != 0 )
          {
            return false;
          }
          KetrisGrid[yOffset+y][xOffset+x] = Color;
        }
      }
    }
    doCheckForLineElimination();
    doGenerateNextElement();
    doCheckForCollision();
  }
}


/*
Do logic for blocks that no longer have blocks beneath them.
*/
function doFallingBlocksLogic() {
  let RealPosition;
  let BlocksStillFalling = false;
  for( let x=0; x<10; x++ ) {
    for( let y=0; y<20; y++ ) {
      if( FallingGrid[y][x] != 0 ) {
        RealPosition = (Config.CollapsingSpeed*
          (Date.now()-FallingGrid[y][x]))+y+0.4;
        BlocksStillFalling = true;
        if( RealPosition+0.6 >= 20 ) {
          FallingGrid[y][x] = 0;
          KetrisGrid[19][x] = FallingColorGrid[y][x];
          FallingColorGrid[y][x] = 0;
          BlocksStillFalling = false;
          doCheckForLineElimination();
        } else if( KetrisGrid[
          Math.round(RealPosition)][x] != 0  ||
          RealPosition+0.6 >= 20 )
        {
          FallingGrid[y][x] = 0;
          KetrisGrid[Math.floor(RealPosition)][x] =
            FallingColorGrid[y][x];
          FallingColorGrid[y][x] = 0;
          BlocksStillFalling = false;
          doCheckForLineElimination();
        }
      }
    }
  }
  if( BlocksStillFalling == true ) {
    myGameState.Falling = true;
    CurrentElement.Timestamp = Date.now();
  }
  else if( BlocksStillFalling == false ) {
    myGameState.Falling = false;
  }
}