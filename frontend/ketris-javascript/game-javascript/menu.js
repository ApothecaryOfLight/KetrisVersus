let StartGameButtonCanvas;
let StartGameButtonCanvasContext;
let DrawMenu = false;
let MenuRedrawTimer;


/*
Draw a menu tile to the menu buffer.

inX: X position to draw the tile to.

inY: Y position to draw the tile to.

inMaxX: Horizontal limit of the menu size.

inMaxY: Vertical limit of the menu size.

inMenuType: Value for future implementation of different menu types.
*/
function doDrawMenuTile( inX, inY, inMaxX, inMaxY, inMenuType ) {
  StartGameButtonCanvasContext = StartGameButtonCanvas.getContext("2d");
  let XOffset = 0;
  let YOffset = 0;
  inMaxX -= 1;
  inMaxY -= 1;
  if( inX == 0 ) {
    if( inY == 0 ) {
      StartGameButtonCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        52, 130, 16, 16,
        inX*16, inY*16, 16, 16
      );
      return;
    }
    if( inY == inMaxY ) {
      StartGameButtonCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        52, 166, 16, 16, inX*16,
        (inY*16)+YOffset, 16, 16
      );
      return;
    }
    StartGameButtonCanvasContext.drawImage(
      myDOMHandles.KetrisImage,
      52, 148, 16, 16,
      inX*16, inY*16, 16, 16
    );
    return;
  }
  if( inX == inMaxX ) {
    if( inY == 0 ) {
      StartGameButtonCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        88, 130, 16, 16,
        (inX*16)+XOffset, inY*16, 16, 16
      );
      return;
    }
    if( inY == inMaxY ) {
      StartGameButtonCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        88, 166, 16, 16,
        (inX*16)+XOffset, (inY*16)+YOffset, 16, 16
      );
      return;
    }
    StartGameButtonCanvasContext.drawImage(
      myDOMHandles.KetrisImage,
      88, 148, 16, 16,
      (inX*16)+XOffset, inY*16, 16, 16
    );
    return;
  }
  if( inY == 0 ) {
    if( inX != 0 && inX != inMaxX ) {
      StartGameButtonCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        70, 130, 16, 16,
        inX*16, inY*16, 16, 16
      );
      return;
    }
  }
  if( inY == inMaxY ) {
    if( inX != 0 && inX != inMaxX ) {
      StartGameButtonCanvasContext.drawImage(
        myDOMHandles.KetrisImage,
        70, 166, 16, 16,
        inX*16, (inY*16)+YOffset, 16, 16
      );
      return;
    }
  }
  StartGameButtonCanvasContext.drawImage(
    myDOMHandles.KetrisImage,
    70, 148, 16, 16,
    inX*16, (inY*16)+YOffset, 16, 16
  );
  return;
}


/*
Compose the menu in the buffer.
*/
function doComposeMenu( inX, inY, inMenuType ) {
  StartGameButtonCanvas = document.createElement("canvas");
  StartGameButtonCanvas.width = inX*16;
  StartGameButtonCanvas.height = inY*16;
  for( let x=0; x<inX; x++ ) {
    for( let y=0; y<inY; y++ ) {
      doDrawMenuTile( x, y, inX, inY, inMenuType );
    }
  }
  StartGameButtonCanvasContext = StartGameButtonCanvas.getContext("2d");
  StartGameButtonCanvasContext.font="20px Georgia";
  StartGameButtonCanvasContext.fillText("Start Game",21,29);
}


/*
Draw the menu from the buffer to the play area.
*/
function doDrawMenu() {
  let myCanvas = document.getElementById( "myKetrisCanvas" );
  let myCanvasContext = myCanvas.getContext( "2d" );
  myCanvasContext.drawImage( StartGameButtonCanvas, 80, 296 );  
}


/*
Start a new game. Function to be called on clicking Start Game button.
*/
function doStartNewGame() {
  console.log( "Starting new game!" );
  Config.Speed = 0.001;
  myGameState.StartGameTimestamp = Date.now();
  for( let x=0; x<10; x++ ) {
    for( let y=0; y<20; y++ ) {
      KetrisGrid[y][x] = 0;
    }
  }
  for( let x=0; x<10; x++ ) {
    for( let y=0; y<20; y++ ) {
      KetrisGrid_Enemy[y][x] = 0;
    }
  }
  myGameState.myScore = 0;
  myGameState.myLastScore = 1;
  myGameState.myEnemyScore = 0;
  myGameState.myLastEnemyScore = 1;
  doGenerateNextElement();
  myGameState.GameOver = false;
  myGameState.GlobalPlay = true;
  DrawMenu = false;
}