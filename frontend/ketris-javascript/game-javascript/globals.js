const myDOMHandles = {
    KetrisImage: new Image(),
    myBackgroundCanvas: null,
    myPlayCanvas: null,
    myMenuCanvas: null,
    myScoreCanvas: null,
    myEnemyScoreCanvas : null
  }

const myWebsocket = {
  keepAlive: null
}

  const myGameState = {
    GlobalPlay: false,
    Paused: false,
    PausedTimestamp: false,
    GameOver: false,
    Falling: false,
    Falling_Enemy: false,
    myName: false,
    myScore: 0,
    myLastScore: 1,
    myEnemyScore: 0,
    myEnemyLastScore: 1,
    StartGameTimestamp: null,
    enemy_visibility: true
  }
  const myAnimationValues = {
    myLastTimestamp: null,
    AnimationFrameHandle: null,
    last: null
  }
  const Config = {
    Speed: 0.001,
    CollapsingSpeed: 0.003,
    ZoomSpeed: 0.005,
    LastLevel: 0
  };
  const CurrentElement = {
    Timestamp: 0,
    XPos: 0,
    YPos: 0,
    Shape: 0,
    Color: 0,
    Rotation: 0,
    TimeZoomButtonHeldTotal: 0,
    ZoomButtonHeld: false,
    NextElement: Math.floor(Math.random()*7),
    NextColor: Math.floor(Math.random()*5)+1
  };
  const CurrentElement_Enemy = {
    Timestamp: 0,
    XPos: 0,
    YPos: 0,
    Shape: -1,
    Color: 0,
    Rotation: 0,
    TimeZoomButtonHeldTotal: 0,
    ZoomButtonHeld: false,
    NextElement: Math.floor(Math.random()*7),
    NextColor: Math.floor(Math.random()*5)
  };