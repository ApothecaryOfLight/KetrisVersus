/*
Function to manage the animation and drawing based on timestamping.
*/
function doManageDrawing( inTimestamp ) {
  let progress;
  if( myAnimationValues.last != null ) {
    progress = inTimestamp - myAnimationValues.last;
    myAnimationValues.last = inTimestamp;
  } else {
    myAnimationValues.last = inTimestamp;
    progress = 0;
  }
  doDraw();
  if( progress < 2000 ) {
    myAnimationValues.AnimationFrameHandle = window.requestAnimationFrame( doManageDrawing );
  }
}


/*
Function to call all drawing functions.
*/
function doDraw() {
  let myCanvas = document.getElementById( "myKetrisCanvas" );
  let myCanvasContext = myCanvas.getContext( "2d" );
  myCanvasContext.clearRect(
    0, 0, myCanvas.width, myCanvas.height
  );

  let myPlayCanvasContext =
    myDOMHandles.myPlayCanvas.getContext( "2d" );

  myPlayCanvasContext.clearRect(
    0,
    0,
    myDOMHandles.myPlayCanvas.width,
    myDOMHandles.myPlayCanvas.height
  );

  doClearCanvas( myDOMHandles.myEnemyCanvas );
  doClearCanvas( myDOMHandles.myPlayerCanvas );

  doDrawBackground();
  doDrawKetrisBlocks();
  doDrawScore();
  doDrawEnemyScore();
  doDrawPreviewBlock();

  if( myGameState.GlobalPlay == true && myGameState.GameOver == false ) {
    if( myGameState.Falling == false ) { doDrawGhostblock(); }
    doDrawCurrentElement();
  }

  doBlit();

  myCanvasContext.drawImage( myDOMHandles.myPlayCanvas, 0, 0 );

  if( DrawMenu == true ) {
    doDrawMenu();
  }
  let TimeElapsed = Date.now() - myGameState.StartGameTimestamp;
  //Config.Speed = 0.001 + ( TimeElapsed/50000000 );
}


/*
Clear the given canvas element.
*/
function doClearCanvas( inCanvas ) {
  let myCanvasContext = inCanvas.getContext( "2d" );
  myCanvasContext.clearRect(
    0, 0, inCanvas.width, inCanvas.height
  );
}


/*
Draw the cached canvases to the play canvases.
*/
function doBlit() {
  var myPlayCanvasContext = myDOMHandles.myPlayCanvas.getContext( "2d" );
  myPlayCanvasContext.drawImage( myDOMHandles.myPlayerCanvas, 0, 0 );
  if( isMobile == false ) {
    myPlayCanvasContext.drawImage(
      myDOMHandles.myEnemyCanvas,
      320, 0/*,
      39.125, 93.625*/
    );
  } else {
    myPlayCanvasContext.drawImage(
      myDOMHandles.myEnemyCanvas,
      260, 0,
      52.16, 124.83
    );
  }
}


/*
Draw a background tile at the given position to the given canvas context.

inX: X position to draw the background tile.

inY: Y position to draw the background tile.

inCanvasContext: Canvas element to draw to.
*/
function doDrawBackgroundTile( inX, inY, inCanvasContext ) {
  let BackgroundColor = 0;
  let XOffset = -8;
  let YOffset = -3;
  if( inX == 0 ) {
    if( inY == 0 ) {
      inCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        0+(BackgroundColor*52), 32,
        16, 16,
        inX*16, inY*16,
        16, 16
      );
      return;
    }
    if( inY == 38 ) {
      inCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        0+(BackgroundColor*52), 68, 16, 16,
        inX*16, (inY*16)+YOffset, 16, 16
      );
      return;
    }
    inCanvasContext.drawImage(
      myDOMHandles.KetrisImage,
      0+(BackgroundColor*52), 50, 16, 16,
      inX*16, inY*16, 16, 16
    );
    return;
  }
  if( inX == 19 ) {
    if( inY == 0 ) {
      inCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        36+(BackgroundColor*52), 32, 16, 16,
        (inX*16)+XOffset, inY*16, 16, 16
      );
      return;
    }
    if( inY == 38 ) {
      inCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        36+(BackgroundColor*52), 68, 16, 16,
        (inX*16)+XOffset, (inY*16)+YOffset, 16, 16
      );
      return;
    }
    inCanvasContext.drawImage(
      myDOMHandles.KetrisImage,
      36+(BackgroundColor*52), 50, 16, 16,
      (inX*16)+XOffset, inY*16, 16, 16
    );
    return;
  }
  if( inY == 0 ) {
    if( inX != 0 && inX != 19 ) {
      inCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        18+(BackgroundColor*52), 32, 16, 16,
        inX*16, inY*16, 16, 16
      );
      return;
    }
  }
  if( inY == 38 ) {
    if( inX != 0 && inX != 19 ) {
      inCanvasContext.drawImage( myDOMHandles.KetrisImage,
        18+(BackgroundColor*52), 68, 16, 16,
        inX*16, (inY*16)+YOffset, 16, 16
      );
      return;
    }
  }
  inCanvasContext.drawImage(
    myDOMHandles.KetrisImage,
    18+(BackgroundColor*52), 50, 16, 16,
    inX*16, (inY*16)+YOffset, 16, 16
  );
  return;
}


/*
Draw a the background to a buffer canvas.
*/
function doComposeBackground() {
  for( let x=0; x<=19; x++ ) {
    for( let y=0; y<=38; y++ ) {
      doDrawBackgroundTile (
        x,
        y,
        myDOMHandles.myBackgroundCanvas.getContext( "2d" )
      );
    }
  }
}


/*
Draw backgrounds from a buffer canvas to the player and enemy canvases.
*/
function doDrawBackground() {
  //Draw player's background
  let myPlayerCanvasContext =
    myDOMHandles.myPlayerCanvas.getContext( "2d" );
  myPlayerCanvasContext.drawImage(
    myDOMHandles.myBackgroundCanvas,
    0, 128
  );

  //Draw enemy's background
  let myEnemyCanvasContext =
    myDOMHandles.myEnemyCanvas.getContext( "2d" );
  myEnemyCanvasContext.drawImage(
    myDOMHandles.myBackgroundCanvas,
    0, 128
  );
}


/*
Draw the preview of where the current element will fall if it is not moved left
or right.
*/
function doDrawGhostblock() {
  let myPlayCanvasContext =
    myDOMHandles.myPlayCanvas.getContext( "2d" );
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let xOffset = Math.floor( CurrentElement.XPos );
  let yOffset = CurrentElement.LastLevel;
  while( isCollision(
    Shape,
    Rotation,
    xOffset,
    yOffset
  ) == false ) {
    yOffset += 1;
  }
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        myPlayCanvasContext.drawImage(
          myDOMHandles.KetrisImage,
          32*5, 0, 32, 32,
          (x+xOffset)*31, ((y+yOffset)*31)+128,
          32, 32
        );
      }
    }
  }
}


/*
Draw the current element to the play area.
*/
function doDrawCurrentElement() {
  let myPlayerCanvasContext =
    myDOMHandles.myPlayerCanvas.getContext( "2d" );
  const myEnemyCanvasContext =
    myDOMHandles.myEnemyCanvas.getContext( "2d" );
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let Color = CurrentElement.Color;

  let xOffset = CurrentElement.XPos;
  let Elapsed = Date.now() - CurrentElement.Timestamp;
  if( myGameState.Falling == true ) { Elapsed = Date.now(); }
  if( myGameState.Paused == true ) {
    Elapsed -= Date.now() - myGameState.PausedTimestamp;
  }
  let yOffset = Config.Speed*Elapsed;

  let xOffset_Enemy = CurrentElement_Enemy.XPos;
  let Elapsed_Enemy = Date.now() - CurrentElement_Enemy.Timestamp;
  if( myGameState.Falling_Enemy == true ) {
    Elapsed_Enemy = Date.now();
  }
  if( myGameState.Paused == true ) {
    Elapsed_Enemy -= Date.now() - myGameState.PausedTimestamp;
  }
  let yOffset_Enemy = Config.Speed*Elapsed_Enemy;

  if( myGameState.Paused == false ) {
    if( Math.floor( yOffset ) == CurrentElement.LastLevel+1 ) {
      doCheckForCollision();
      CurrentElement.LastLevel += 1;
    }
  }
  if( myGameState.GlobalPlay == true && myGameState.GameOver == false ) {
    for( let x=0; x<4; x++ ) {
      for( let y=0; y<4; y++ ) {
        if( Shapes[Shape][Rotation][x][y] == 1 ) {
          myPlayerCanvasContext.drawImage(
            myDOMHandles.KetrisImage,
            (Color-1)*32, 0, 32, 32,
            (xOffset+x)*31, ((yOffset+y)*31)+128,
            32, 32
          );
        }
        if( CurrentElement_Enemy.Shape != -1 ) {
          if( Shapes
            [CurrentElement_Enemy.Shape]
            [CurrentElement_Enemy.Rotation]
            [x][y] == 1
          ) {
            myEnemyCanvasContext.drawImage(
              myDOMHandles.KetrisImage,
              (CurrentElement_Enemy.Color-
                1)*32, 0, 32, 32,
              ((xOffset_Enemy+x)*31),
              ((yOffset_Enemy+y)*31)+146,
              32, 32
            );
          }
        }
      }
    }
  }
}


/*
Draw the blocks that have already fallen.
*/
function doDrawKetrisBlocks() {
  let myPlayerCanvasContext =
    myDOMHandles.myPlayerCanvas.getContext( "2d" );
  let myEnemyCanvasContext =
    myDOMHandles.myEnemyCanvas.getContext( "2d" );
  doFallingBlocksLogic();
  doFallingBlocksLogic_Enemy();
  for( let x=0; x<10; x++ ) {
    for( let y=0; y<20; y++ ) {

      if( KetrisGrid[y][x] != 0  && FallingGrid[y][x] == 0 ) {
        myPlayerCanvasContext.drawImage(
          myDOMHandles.KetrisImage,
          (KetrisGrid[y][x]-1)*32, 0,
          32, 32,
          x*31, (y*31)+128,
          32, 32
        );
      }
      if( FallingGrid[y][x] != 0 ) {
        let RealPosition = ( Config.CollapsingSpeed *
          (Date.now()-FallingGrid[y][x]))+y;
        myPlayerCanvasContext.drawImage(
          myDOMHandles.KetrisImage,
          (FallingColorGrid[y][x]-1)*32, 0,
          32, 32,
          (x*31), ((RealPosition)*31)+128,
          32, 32
        );
      }

      if(
        KetrisGrid_Enemy[y][x] != 0 &&
        FallingGrid_Enemy[y][x] == 0
      ) {
        myEnemyCanvasContext.drawImage(
          myDOMHandles.KetrisImage,
          (KetrisGrid_Enemy[y][x]-1)*32, 0,
          32, 32,
          (x*31), (y*31)+128,
          32, 32
        );
      }
      if( FallingGrid_Enemy[y][x] != 0 ) {
        let RealPosition = ( Config.CollapsingSpeed *
          (Date.now()-FallingGrid_Enemy[y][x]))+y;
        myEnemyCanvasContext.drawImage(
          myDOMHandles.KetrisImage,
          (FallingColorGrid_Enemy[y][x]-1)*32, 0,
          32, 32,
          (x*31), ((RealPosition)*31)+128,
          32, 32
        );
      }
    }
  }
}


/*
Draw the shape that will be spawned next.
*/
function doDrawPreviewBlock() {
  let toDrawShape = CurrentElement.NextElement;
  let toDrawColor = CurrentElement.NextColor;
  let myPlayCanvasContext =
    myDOMHandles.myPlayCanvas.getContext( "2d" );
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      if( Shapes[toDrawShape][0][x][y] == 1 ) {
        myPlayCanvasContext.drawImage(
          myDOMHandles.KetrisImage,
          (toDrawColor-1)*32, 0, 32, 32,
          ((x)*31)+150, ((y)*31)+25,
          32, 32
        );
      }
    }
  }
}