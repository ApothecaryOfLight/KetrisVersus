let StartGameButtonCanvas;
let StartGameButtonCanvasContext;
let StartGameButtonCanvasMouseover;
let StartGameButtonCanvasContextMouseover;
let DrawMenu = false;
let MenuRedrawTimer;


/*
Array containing menu button Objects.
*/
const MenuButtons = [
  {
    text: "Start Game",
    font: "",
    xPos: 21,
    yPos: 29,
    event: doStartNewGame,
    desktop_click: {
      xStart: 80,
      yStart: 188,
      xEnd: 240,
      yEnd: 236
    },
    mobile_click: {
      xStart: 59,
      yStart: 221,
      xEnd: 178,
      yEnd: 256
    }
  }
];


/*
Draw a menu tile to the menu buffer.

inX: X position to draw the tile to.

inY: Y position to draw the tile to.

inMaxX: Horizontal limit of the menu sprite atlas soruce.

inMaxY: Vertical limit of the menu sprite atlas soruce.

inMenuType: Value for future implementation of different menu types.

inCanvasTarget: Buffer canvas to draw the button tile to.
*/
function doDrawMenuTile( inX, inY, srcX, srcY, inMaxX, inMaxY, inMenuType, inCanvasTarget ) {

  let XOffset = 0;
  let YOffset = 0;
  inMaxX -= 1;
  inMaxY -= 1;

  //If this tile is along the top of the button:
  if( inX == 0 ) {
    //If this tile is in the upper-left corner:
    if( inY == 0 ) {
      inCanvasTarget.drawImage(
        myDOMHandles.KetrisImage,
        srcX, srcY, 16, 16,
        inX*16, inY*16, 16, 16
      );
      return;
    }
    //If this tile is in the lower left corner:
    if( inY == inMaxY ) {
      inCanvasTarget.drawImage(
        myDOMHandles.KetrisImage,
        srcX, srcY+36, 16, 16, inX*16,
        (inY*16)+YOffset, 16, 16
      );
      return;
    }
    //If this tile is in neither corner:
    inCanvasTarget.drawImage(
      myDOMHandles.KetrisImage,
      srcX, srcY+18, 16, 16,
      inX*16, inY*16, 16, 16
    );
    return;
  }
  //If this tile is against the right edge of the button:
  if( inX == inMaxX ) {
    //If this tile is in the upper-right of the buttoner:
    if( inY == 0 ) {
      inCanvasTarget.drawImage(
        myDOMHandles.KetrisImage,
        srcX+36, srcY, 16, 16,
        (inX*16)+XOffset, inY*16, 16, 16
      );
      return;
    }
    //If this tile is in the lower-right of the button:
    if( inY == inMaxY ) {
      inCanvasTarget.drawImage(
        myDOMHandles.KetrisImage,
        srcX+36, srcY+36, 16, 16,
        (inX*16)+XOffset, (inY*16)+YOffset, 16, 16
      );
      return;
    }
    //If this tile is in neither corner:
    inCanvasTarget.drawImage(
      myDOMHandles.KetrisImage,
      srcX+36, srcY+18, 16, 16,
      (inX*16)+XOffset, inY*16, 16, 16
    );
    return;
  }
  //If this tile is along the top of the button:
  if( inY == 0 ) {
    //If this tile is in neither corner:
    if( inX != 0 && inX != inMaxX ) {
      inCanvasTarget.drawImage(
        myDOMHandles.KetrisImage,
        srcX+18, srcY, 16, 16,
        inX*16, inY*16, 16, 16
      );
      return;
    }
  }
  //If this tile is along the bottom of the button:
  if( inY == inMaxY ) {
    if( inX != 0 && inX != inMaxX ) {
      inCanvasTarget.drawImage(
        myDOMHandles.KetrisImage,
        srcX+18, srcY+36, 16, 16,
        inX*16, (inY*16)+YOffset, 16, 16
      );
      return;
    }
  }
  //If this tile is not on any edge or in any corner:
  inCanvasTarget.drawImage(
    myDOMHandles.KetrisImage,
    srcX+18, srcY+18, 16, 16,
    inX*16, (inY*16)+YOffset, 16, 16
  );
  return;
}


/*
Compose the menu in the buffer.
*/
function doComposeMenu( inX, inY, inMenuType ) {
  //Build the menu button in a buffer canvas for when the button does not have the
  //mouse over it.
  StartGameButtonCanvas = document.createElement("canvas");
  StartGameButtonCanvasContext = StartGameButtonCanvas.getContext("2d");
  StartGameButtonCanvas.width = inX*16;
  StartGameButtonCanvas.height = inY*16;
  for( let x=0; x<inX; x++ ) {
    for( let y=0; y<inY; y++ ) {
      doDrawMenuTile( x, y, 52, 130, inX, inY, inMenuType, StartGameButtonCanvasContext );
    }
  }
  StartGameButtonCanvasContext.font="20px Georgia";
  StartGameButtonCanvasContext.fillText("Start Game",21,29);

  
  //Build the menu button in a buffer canvas for when the button does have the
  //mouse over it.
  StartGameButtonCanvasMouseover = document.createElement("canvas");
  StartGameButtonCanvasContextMouseover = StartGameButtonCanvasMouseover.getContext("2d");
  StartGameButtonCanvasMouseover.width = inX*16;
  StartGameButtonCanvasMouseover.height = inY*16;
  for( let x=0; x<inX; x++ ) {
    for( let y=0; y<inY; y++ ) {
      doDrawMenuTile( x, y, 0, 130, inX, inY, inMenuType, StartGameButtonCanvasContextMouseover );
    }
  }
  StartGameButtonCanvasContextMouseover.font="20px Georgia";
  StartGameButtonCanvasContextMouseover.fillText("Start Game",21,29);
}


/*
Draw the menu from the buffer to the play area.
*/
function doDrawMenu( inButtonType ) {
  //Get the Ketris canvas reference.
  let myCanvas = document.getElementById( "myKetrisCanvas" );
  let myCanvasContext = myCanvas.getContext( "2d" );

  //If the the mouse is not over the button, draw it as default.
  if( inButtonType == "default" ) {
    myCanvasContext.drawImage(
      StartGameButtonCanvas,
      MenuButtons[0].desktop_click.xStart,
      MenuButtons[0].desktop_click.yStart + 128
    );
  } else if( inButtonType == "mouseover" ) {
    //Otherwise, given that the mouse is over the button, draw it in mouseover
    //mode.
    myCanvasContext.drawImage(
      StartGameButtonCanvasMouseover,
      MenuButtons[0].desktop_click.xStart,
      MenuButtons[0].desktop_click.yStart + 128
    );
  }
}


/*
Start a new game. Function to be called on clicking Start Game button.
*/
function doStartNewGame() {
  console.log( "Starting new game!" );

  //Reset the global variables to default values.
  format_globals();

  //Set other relevant values, such as blanking the Ketris grid.
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

  
  //Begin the animation request sequence.
  myAnimationValues.AnimationFrameHandle =
    window.requestAnimationFrame( doManageDrawing );
}