/*
Function to manage the animation and drawing based on timestamping.

This is the root of all the drawing functions.

This relies on the modern requestAnimationFrame function.

doManageDrawing is called by requestAnimationFrame, which hands it a single
argument consisting of a timestamp depicting time elapsed since the page was
loaded.
*/
function doManageDrawing( inTimestamp ) {
  //Create a variable to hold the time elapsed information.
  let progress;

  //If there is a previous timestamp:
  if( myAnimationValues.last != null ) {
    //Get the time passed since the last timestamp.
    progress = inTimestamp - myAnimationValues.last;

    //Replace the last timestamp with this timestamp.
    myAnimationValues.last = inTimestamp;
  } else { //If there isn't a previous timestamp:
    //Set the previous timestamp to this timestamp.
    myAnimationValues.last = inTimestamp;

    //Set the time elapsed to 0.
    progress = 0;
  }

  //Draw the graphics.
  doDraw();

  //Call requestAnimationFrame to queue up the next doManageDrawing call.
  //Store the returned value, which can be used to cancel the requestAnimationFrame
  //callback.
  myAnimationValues.AnimationFrameHandle = window.requestAnimationFrame( doManageDrawing );
}


/*
Function to call all drawing functions.
*/
function doDraw() {
  //Get a reference to the canvas.
  const myCanvas = document.getElementById( "myKetrisCanvas" );
  const myCanvasContext = myCanvas.getContext( "2d" );

  //Clear the canvas.
  myCanvasContext.clearRect(
    0,
    0,
    myCanvas.width,
    myCanvas.height
  );

  //Get a reference to the canvas.
  const myBufferCanvasContext = myDOMHandles.myBufferCanvas.getContext( "2d" );

  //Clear the canvas.
  myBufferCanvasContext.clearRect(
    0,
    0,
    myDOMHandles.myBufferCanvas.width,
    myDOMHandles.myBufferCanvas.height
  );

  //Clear the player and enemy game area canvases.
  doClearCanvas( myDOMHandles.myEnemyCanvas );
  doClearCanvas( myDOMHandles.myPlayerCanvas );

  //Call the various drawing functions.
  doDrawBackground();
  doDrawKetrisBlocks();
  doDrawScore();
  doDrawEnemyScore();
  doDrawPreviewBlock();

  //If the game is being played and not finished:
  if( myGameState.GlobalPlay == true && myGameState.GameOver == false ) {
    //If there is a current element, and it is not in drop mode:
    if( myGameState.Falling == false ) {
      //Then draw the preview of where the falling block will land.
      doDrawGhostblock();
    }
    //Regardless, draw the current element.
    doDrawCurrentElement();
  }

  //Copy the buffered images to the visible canvases.
  doBlit();

  //Draw the buffer canvas to the displayed canvas.
  myCanvasContext.drawImage( myDOMHandles.myBufferCanvas, 0, 0 );

  //If the menu is visible:
  if( DrawMenu == true ) {
    //Draw the menu.
    if( mouseover_objects.start_game_button == false ) {
      doDrawMenu("default");
    } else if( mouseover_objects.start_game_button == true ) {
      doDrawMenu("mouseover");
    }
  }

  //Store a value that represents how much time has elapsed since the game began.
  let TimeElapsed = Date.now() - myGameState.StartGameTimestamp;
  //Config.Speed = 0.001 + ( TimeElapsed/50000000 );
}


/*
Clear the given canvas element.

inCanvas: Reference to the canvas you want to clear.
*/
function doClearCanvas( inCanvas ) {
  //Get a reference to the desired canvas context.
  const myCanvasContext = inCanvas.getContext( "2d" );

  //Clear the given canvas.
  myCanvasContext.clearRect(
    0,
    0,
    inCanvas.width,
    inCanvas.height
  );
}


/*
Draw the cached canvases to the play canvases.
*/
function doBlit() {
  //Get a reference to the play canvas.
  var myBufferCanvasContext = myDOMHandles.myBufferCanvas.getContext( "2d" );

  //Draw the cahced player canvas to the visible canvas.
  myBufferCanvasContext.drawImage( myDOMHandles.myPlayerCanvas, 0, 0 );

  //Check if this is not mobile:
  if( isMobile == false ) {
    //If it is not mobile, then draw the enemy canvas at the given position.
    myBufferCanvasContext.drawImage(
      myDOMHandles.myEnemyCanvas,
      320,
      0
    );
  } else {
    //Otherwise,  if it is mobile, draw the enemy canvas at the given position and
    //with the given width and height variables.
    myBufferCanvasContext.drawImage(
      myDOMHandles.myEnemyCanvas,
      260,
      0,
      52.16,
      124.83
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
  //Set the background color. This acts as an array offset to be used in retrieving
  //the desired background color tile from the sprite atlas.
  const BackgroundColor = 0;

  //Set drawing offset values, to precisely position the drawn elements.
  const XOffset = -8;
  const YOffset = -3;

  //If this is one of the leftmost tiles:
  if( inX == 0 ) {
    //If this is the element of the upper-left corner:
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
    //If this is the element of the bottom-left corner:
    if( inY == 38 ) {
      inCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        0+(BackgroundColor*52), 68, 16, 16,
        inX*16, (inY*16)+YOffset, 16, 16
      );
      return;
    }
    //Otherwise, if this is an element against the left edge, but neither at the
    //top nor the bottom of the play area:
    inCanvasContext.drawImage(
      myDOMHandles.KetrisImage,
      0+(BackgroundColor*52), 50, 16, 16,
      inX*16, inY*16, 16, 16
    );
    return;
  }
  //If this is one of the rightmost tiles:
  if( inX == 19 ) {
    //If this is the tile in the upper-right hand corner:
    if( inY == 0 ) {
      inCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        36+(BackgroundColor*52), 32, 16, 16,
        (inX*16)+XOffset, inY*16, 16, 16
      );
      return;
    }
    //If this is the tile in the lower-right hand corner:
    if( inY == 38 ) {
      inCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        36+(BackgroundColor*52), 68, 16, 16,
        (inX*16)+XOffset, (inY*16)+YOffset, 16, 16
      );
      return;
    }
    //If this tile is against the right-edge of the play area, but is not the at
    //the top or the bottom of the play area:
    inCanvasContext.drawImage(
      myDOMHandles.KetrisImage,
      36+(BackgroundColor*52), 50, 16, 16,
      (inX*16)+XOffset, inY*16, 16, 16
    );
    return;
  }

  //If this is one of the top-most tiles:
  if( inY == 0 ) {
    //If this is not a tile in one of the corners:
    if( inX != 0 && inX != 19 ) {
      inCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        18+(BackgroundColor*52), 32, 16, 16,
        inX*16, inY*16, 16, 16
      );
      return;
    }
  }
  //If this is one of the bottom-most tiles:
  if( inY == 38 ) {
    //If this is not a tile in one of the corners:
    if( inX != 0 && inX != 19 ) {
      inCanvasContext.drawImage( myDOMHandles.KetrisImage,
        18+(BackgroundColor*52), 68, 16, 16,
        inX*16, (inY*16)+YOffset, 16, 16
      );
      return;
    }
  }

  //Otherwise, if this is a tile not on any of the edges nor corners:
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
  //Iterate through every tile needed to draw the play area.
  for( let x=0; x<=19; x++ ) {
    for( let y=0; y<=38; y++ ) {
      //Draw a tile at the given place.
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
    0,
    128
  );

  //Draw enemy's background
  let myEnemyCanvasContext =
    myDOMHandles.myEnemyCanvas.getContext( "2d" );
  myEnemyCanvasContext.drawImage(
    myDOMHandles.myBackgroundCanvas,
    0,
    128
  );
}


/*
Draw the preview of where the current element will fall if it is not moved left
or right.
*/
function doDrawGhostblock() {
  //Get a reference to the play canvas.
  let myPlayerCanvasContext = myDOMHandles.myPlayerCanvas.getContext( "2d" );

  //Get information about the current shape.
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let xOffset = Math.floor( CurrentElement.XPos );
  let yOffset = CurrentElement.LastLevel;

  //Get the position of the ghost block to draw by attempting to place the current
  //element until it collides with something underneath it.
  while( isCollision(
    Shape,
    Rotation,
    xOffset,
    yOffset
  ) == false ) {
    yOffset += 1;
  }

  //Draw this shape, at this rotation, but at the location we deteremined for the
  //ghostblock in the while loop above. Also ensure that the ghost-block is drawn
  //of ghostly (gray-colored) blocks.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      if( Shapes[Shape][Rotation][x][y] == 1 ) {
        myPlayerCanvasContext.drawImage(
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
  //Get the play and enemy canvases.
  let myPlayerCanvasContext = myDOMHandles.myPlayerCanvas.getContext( "2d" );
  const myEnemyCanvasContext = myDOMHandles.myEnemyCanvas.getContext( "2d" );

  //Get the current shape information.
  let Shape = CurrentElement.Shape;
  let Rotation = CurrentElement.Rotation;
  let Color = CurrentElement.Color;
  let xOffset = CurrentElement.XPos;
  let Elapsed = Date.now() - CurrentElement.Timestamp;

  //If the already placed blocks are falling, the next element should not start
  //dropping yet, so take away the CurrentElement.Timestamp modifier.
  if( myGameState.Falling == true ) {
    Elapsed = Date.now();
  }

  //If the game is paused, then hold the block in place by applying the time since the
  //pause began to the timestamp value.
  if( myGameState.Paused == true ) {
    Elapsed -= Date.now() - myGameState.PausedTimestamp;
  }

  //Apply the speed modifier.
  let yOffset = Config.Speed*Elapsed;

  //Apply the same logic as above to the enemy's current element.
  let xOffset_Enemy = CurrentElement_Enemy.XPos;
  let Elapsed_Enemy = Date.now() - CurrentElement_Enemy.Timestamp;
  
  //If the already placed blocks are falling, the next element should not start
  //dropping yet, so take away the CurrentElement.Timestamp modifier.
  if( myGameState.Falling_Enemy == true ) {
    Elapsed_Enemy = Date.now();
  }
  
  //If the game is paused, then hold the block in place by applying the time since the
  //pause began to the timestamp value.
  if( myGameState.Paused == true ) {
    Elapsed_Enemy -= Date.now() - myGameState.PausedTimestamp;
  }
  
  //Apply the speed modifier.
  let yOffset_Enemy = Config.Speed*Elapsed_Enemy;

  //If the game is not paused:
  if( myGameState.Paused == false ) {
    //If the element has reached the next lower block level, increment its position
    //and check for collisions.
    if( Math.floor( yOffset ) == CurrentElement.LastLevel+1 ) {
      doCheckForCollision();
      CurrentElement.LastLevel += 1;
    }
  }

  //If the game is still going:
  if( myGameState.GlobalPlay == true && myGameState.GameOver == false ) {
    //Iterate through every place in the shape:
    for( let x=0; x<4; x++ ) {
      for( let y=0; y<4; y++ ) {
        //If there is a block in this place, draw it.
        if( Shapes[Shape][Rotation][x][y] == 1 ) {
          myPlayerCanvasContext.drawImage(
            myDOMHandles.KetrisImage,
            (Color-1)*32, 0, 32, 32,
            (xOffset+x)*31, ((yOffset+y)*31)+128,
            32, 32
          );
        }

        //If the enemy has a current shape:
        if( CurrentElement_Enemy.Shape != -1 ) {
          //If the enemy's shape has a block in this place, draw it.
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
  //Get the canvas context for the player and enemy play areas.
  let myPlayerCanvasContext = myDOMHandles.myPlayerCanvas.getContext( "2d" );
  let myEnemyCanvasContext = myDOMHandles.myEnemyCanvas.getContext( "2d" );

  //Do the falling block logic for both player and the enemy.
  doFallingBlocksLogic();
  doFallingBlocksLogic_Enemy();

  //Iterate over each place the play area.
  for( let x=0; x<10; x++ ) {
    for( let y=0; y<20; y++ ) {
      //If there is a block in this place and it is not falling, draw it.
      if( KetrisGrid[y][x] != 0  && FallingGrid[y][x] == 0 ) {
        myPlayerCanvasContext.drawImage(
          myDOMHandles.KetrisImage,
          (KetrisGrid[y][x]-1)*32, 0,
          32, 32,
          x*31, (y*31)+128,
          32, 32
        );
      }

      //If there is a block in this place and it is falling, draw it.
      if( FallingGrid[y][x] != 0 ) {
        //Get the position of the falling block.
        let RealPosition = ( Config.CollapsingSpeed *
          (Date.now()-FallingGrid[y][x]))+y;
        
        //Draw it.
        myPlayerCanvasContext.drawImage(
          myDOMHandles.KetrisImage,
          (FallingColorGrid[y][x]-1)*32, 0,
          32, 32,
          (x*31), ((RealPosition)*31)+128,
          32, 32
        );
      }

      //Apply the same logic as above to the enemy play area.
      //If there is a block in this place and it is not falling, draw it.
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

      //If there is a block in this place and it is falling, draw it.
      if( FallingGrid_Enemy[y][x] != 0 ) {
        //Get the position of the falling block.
        let RealPosition = ( Config.CollapsingSpeed *
          (Date.now()-FallingGrid_Enemy[y][x]))+y;
        
        //Draw it.
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
  //Get the information of the next shape.
  let toDrawShape = CurrentElement.NextElement;
  let toDrawColor = CurrentElement.NextColor;

  //Get the canvas context of the player's play area.
  let myBufferCanvasContext = myDOMHandles.myBufferCanvas.getContext( "2d" );

  let mobile_offset = 0;
  if( isMobile ) {
    mobile_offset = -32;
  }

  //Iterate over every place in the next shape.
  for( let x=0; x<4; x++ ) {
    for( let y=0; y<4; y++ ) {
      //If there is a block in this place, draw it.
      if( Shapes[toDrawShape][0][x][y] == 1 ) {
        myBufferCanvasContext.drawImage(
          myDOMHandles.KetrisImage,
          (toDrawColor-1)*32, 0,
          32, 32,
          ((x)*31)+150+mobile_offset, ((y)*31)+25,
          32, 32
        );
      }
    }
  }
}