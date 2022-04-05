function doLaunchKetrisGameplayer() {
    console.log( "Launching Ketris Gameplayer." );
    let playCanvasWidth = 313;
    if( isMobile == false ) {
      playCanvasWidth = 313*2;
    } else {
      const myKetrisCanvas = document.getElementById("myKetrisCanvas");
      const myKetrisCanvasContext = myKetrisCanvas.getContext("2d");
      myKetrisCanvasContext.canvas.width = 313;
    }
    myDOMHandles.KetrisImage.src = "ketris_media/spritesheet_mod.png";
    myDOMHandles.KetrisImage.onload = function() {
      console.log( "Images loaded.");
      myDOMHandles.myBackgroundCanvas = document.createElement("canvas");
      myDOMHandles.myBackgroundCanvas.width = playCanvasWidth;
      myDOMHandles.myBackgroundCanvas.height = 749;

      myDOMHandles.myPlayCanvas = document.createElement("canvas");
      myDOMHandles.myPlayCanvas.width = playCanvasWidth;
      myDOMHandles.myPlayCanvas.height = 749;

      myDOMHandles.myMenuCanvas = document.createElement("canvas");
      myDOMHandles.myMenuCanvas.width = playCanvasWidth;
      myDOMHandles.myMenuCanvas.height = 749;

      myDOMHandles.myScoreCanvas = document.createElement("canvas");
      myDOMHandles.myScoreCanvas.width = 10*15;
      myDOMHandles.myScoreCanvas.height = 16;

      myDOMHandles.myEnemyScoreCanvas = document.createElement("canvas");
      myDOMHandles.myEnemyScoreCanvas.width = 10*15;
      myDOMHandles.myEnemyScoreCanvas.height = 16;

      myDOMHandles.myPlayerCanvas = document.createElement("canvas");
      myDOMHandles.myPlayerCanvas.width = 313;
      myDOMHandles.myPlayerCanvas.height = 749;

      myDOMHandles.myEnemyCanvas = document.createElement("canvas");
      myDOMHandles.myEnemyCanvas.width = 313;
      myDOMHandles.myEnemyCanvas.height = 749;

      doComposeBackground();

      //TODO: Put in an initial start button.
      doStartNewGame();

      myAnimationValues.AnimationFrameHandle =
        window.requestAnimationFrame( doManageDrawing );
      //doManageDrawing();
      //timerDraw = setInterval( doDraw, 10 );
    };
  }