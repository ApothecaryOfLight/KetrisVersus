function doGravity_Enemy( inX, inY ) {
    let FallingTimestamp = Date.now();
    for( let y=inY; y>0; y-- ) {
      if( KetrisGrid_Enemy[y][inX] != 0 ) {
        FallingGrid_Enemy[y][inX] = FallingTimestamp;
        FallingColorGrid_Enemy[y][inX] = KetrisGrid_Enemy[y][inX];
        KetrisGrid_Enemy[y][inX] = 0;
      }
      myGameState.Falling_Enemy = true;
    }
  }

  function doLineElimination_Enemy( inLineNumber ) {//TODO: Here's where to recog
    for( let x=0; x<10; x++ ) {
      KetrisGrid_Enemy[inLineNumber][x] = 0;
      doGravity_Enemy( x, inLineNumber );
    }
  }

  function doCheckLine_Enemy( inLineNumber ) {
    for( let x=0; x<10; x++ ) {
      if( KetrisGrid_Enemy[inLineNumber][x] == 0 ) {
        return true;
      }
    }
    return false;
  }

  function doCheckForLineElimination_Enemy() {
    let Rerun_Enemy = false;
    for( let y=0; y<20; y++ ) {
      if( doCheckLine_Enemy( y ) == false ) {
        Rerun_Enemy = true;
        doLineElimination_Enemy( y );
      }
    }
    if( Rerun_Enemy == true ) {
      doCheckForLineElimination_Enemy();
    }
  }
  
  
  function doTransposeElement_Enemy() {
    //console.log( "Transposing enemy shape." );
    let Shape = CurrentElement_Enemy.Shape;
    let Rotation = CurrentElement_Enemy.Rotation;
    let Color = CurrentElement_Enemy.Color;
    let xOffset = Math.floor( CurrentElement_Enemy.XPos );
    let Elapsed = Date.now() -
      CurrentElement_Enemy.Timestamp;
    let yOffset = CurrentElement_Enemy.YPos;

    for( let y=0; y<4; y++ ) {
      for( let x=0; x<4; x++ ) {
        if( Shapes[Shape][Rotation][x][y] == 1 ) {
          if( KetrisGrid_Enemy[yOffset+y][xOffset+x] != 0 ) {
            return false;
          }
          KetrisGrid_Enemy[yOffset+y][xOffset+x] = Color;
        }
      }
    }
    doCheckForLineElimination_Enemy();
    return true;
  }

function doFallingBlocksLogic_Enemy() {
    let RealPosition_Enemy;
    let BlocksStillFalling_Enemy = false;
    for( let x=0; x<10; x++ ) {
      for( let y=0; y<20; y++ ) {
        if( FallingGrid_Enemy[y][x] != 0 ) {
          RealPosition_Enemy = (Config.CollapsingSpeed*
            (Date.now()-FallingGrid_Enemy[y][x]))+y+0.4;
          BlocksStillFalling_Enemy = true;
          if( RealPosition_Enemy+0.6 >= 20 ) {
            FallingGrid_Enemy[y][x] = 0;
            KetrisGrid_Enemy[19][x] =
              FallingColorGrid_Enemy[y][x];
            FallingColorGrid_Enemy[y][x] = 0;
            BlocksStillFalling_Enemy = false;
            doCheckForLineElimination_Enemy();
          } else if( KetrisGrid_Enemy[
            Math.round(RealPosition_Enemy)][x] != 0  ||
            RealPosition_Enemy+0.6 >= 20 )
          {
            FallingGrid_Enemy[y][x] = 0;
            KetrisGrid_Enemy[Math.floor(
              RealPosition_Enemy)][x] =
              FallingColorGrid_Enemy[y][x];
            FallingColorGrid_Enemy[y][x] = 0;
            BlocksStillFalling_Enemy = false;
            doCheckForLineElimination_Enemy();
          }
        }
      }
    }
    if( BlocksStillFalling_Enemy == true ) {
      myGameState.Falling_Enemy = true;
      CurrentElement_Enemy.Timestamp = Date.now();
    }
    else if( BlocksStillFalling_Enemy == false ) {
      myGameState.Falling_Enemy = false;
    }
  }