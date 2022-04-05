//////////////////////////////////////////////////////////////////////////////
//  Collision Functions  /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function doCheckForCollision() {
    let Shape = CurrentElement.Shape;
    let Rotation = CurrentElement.Rotation;
    let xOffset = Math.floor( CurrentElement.XPos );
    let Elapsed = Date.now() - CurrentElement.Timestamp;
    let yOffset = Math.floor( (Config.Speed)*Elapsed );

    for( let x=0; x<4; x++ ) {
      for( let y=0; y<4; y++ ) {
        if( Shapes[Shape][Rotation][x][y] == 1 ) {
          if( ( yOffset + y ) >= 19 ) {
            doSendCollisionEvent( yOffset );
            doTransposeElement();
            return;
          }
          if( KetrisGrid[yOffset+y+1][xOffset+x] != 0 ) {
            //console.log("Collision!");
            doSendCollisionEvent( yOffset );
            if( doTransposeElement() == false ) {
              console.log( "Game over!" );
              myGameState.GlobalPlay = false;
              myGameState.GameOver = true;
              let end_game = JSON.stringify({
                type: 'game_event',
                event: 'client_end_game'
              });
              connection.send( end_game );

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
  function isRotationAllowed( inShape, inCurrentRotation,
    inNextRotation, inX, inY ) {
    //console.log("isRotationAllowed called");
    if( inNextRotation > 3 ) { inNextRotation = 0 ; }
    let xOffset = CurrentElement.XPos;
    let Elapsed = Date.now() - CurrentElement.Timestamp;
    let yOffset = Math.floor( Config.Speed*Elapsed )+1;

    for( let x=0; x<4; x++ ) {
      for( let y=0; y<4; y++ ) {
        if( Shapes[inShape][inNextRotation][x][y] == 1 &&
          KetrisGrid[y+yOffset][x+xOffset] != 0 ) {
          console.log(
            "Collision detected! Rotation rejected."
          );
          return false;
        }
      }
    }
    console.log("Proper rotation. Approved");
    return true;
  }
  function doProcessWallkicks() {
    //console.log( "rotation: " + CurrentElement.Rotation );
    let newRotation = CurrentElement.Rotation+1;
    if( newRotation > 3) { newRotation = 0; }

    for( let x=0; x<4; x++ ) {
      for( let y=0; y<4; y++ ) {
        while( Shapes
          [CurrentElement.Shape]
          [newRotation]
          [x]
          [y] == 1 &&
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