function doComposeScore( inNumber, inPlace ) {
    //console.log( "Do compose score." );
    let myScoreCanvasContext =
      myDOMHandles.myScoreCanvas.getContext( "2d" );
    myScoreCanvasContext.drawImage(
      myDOMHandles.KetrisImage,
      inNumber*11, 500,
      10, 16,
      (inPlace*11), 0,
      10, 16
    );
  }

  function doSendScoreUpdate() { //bookmark
    let score = JSON.stringify({
      type: "game_event",
      event: "client_score",
      score: myGameState.myScore
    });
    connection.send( score );
  }

  function doDrawScore() {
    if( myGameState.myLastScore != myGameState.myScore ) {
      myGameState.myLastScore = myGameState.myScore;
      doSendScoreUpdate(); //TODO: Implement enemy scoring

      let myScoreCanvasContext =
        myDOMHandles.myScoreCanvas.getContext( "2d" );
      myScoreCanvasContext.clearRect(
        0, 0,
        myDOMHandles.myScoreCanvas.width,
        myDOMHandles.myScoreCanvas.height
      );

      let myScore = myGameState.myScore.toString();
      for( let myDigitKey in myScore ) {
        doComposeScore( myScore[myDigitKey], myDigitKey );
      }
    }
    let myPlayCanvasContext =
      myDOMHandles.myPlayCanvas.getContext( "2d" );
    let myScoreCanvasContext =
      myDOMHandles.myScoreCanvas.getContext( "2d" );
    myPlayCanvasContext.drawImage(
      myDOMHandles.myScoreCanvas,
      0, 0,
      myDOMHandles.myScoreCanvas.width,
      myDOMHandles.myScoreCanvas.height,
      25, 25,
      myDOMHandles.myScoreCanvas.width,
      myDOMHandles.myScoreCanvas.height
    );
  }

  function doComposeEnemyScore( inNumber, inPlace ) {
    //console.log( "Do compose enemy score." );
    let myEnemyScoreCanvasContext =
      myDOMHandles.myEnemyScoreCanvas.getContext( "2d" );
    myEnemyScoreCanvasContext.drawImage(
      myDOMHandles.KetrisImage,
      inNumber*11, 500,
      10, 16,
      (inPlace*11), 0,
      10, 16
    );
  }

  function doDrawEnemyScore() {
    if( myGameState.myEnemyLastScore != myGameState.myEnemyScore ) {
      myGameState.myEnemyLastScore = myGameState.myEnemyScore;

      let myEnemyScoreCanvasContext =
        myDOMHandles.myEnemyScoreCanvas.getContext( "2d" );
      myEnemyScoreCanvasContext.clearRect(
        0, 0,
        myDOMHandles.myEnemyScoreCanvas.width,
        myDOMHandles.myEnemyScoreCanvas.height
      );

      let myEnemyScore = myGameState.myEnemyScore.toString();
      for( let myDigitKey in myEnemyScore ) {
        doComposeEnemyScore( myEnemyScore[myDigitKey], myDigitKey );
      }
    }
    let myPlayCanvasContext =
      myDOMHandles.myPlayCanvas.getContext( "2d" );
    myPlayCanvasContext.drawImage(
      myDOMHandles.myEnemyScoreCanvas,
      0, 0,
      myDOMHandles.myEnemyScoreCanvas.width,
      myDOMHandles.myEnemyScoreCanvas.height,
      (25)+313, 25,
      myDOMHandles.myEnemyScoreCanvas.width,
      myDOMHandles.myEnemyScoreCanvas.height
    );
  }