'use strict';

let connection;

const mouseover_objects = {
  start_game_button: false
}

let StartGameButtonCanvas;
let StartGameButtonCanvasContext;
let StartGameButtonCanvasMouseover;
let StartGameButtonCanvasContextMouseover;
let DrawMenu = false;
let MenuRedrawTimer;


/*
Set the global variables to their default values.
*/
function format_globals() {
  myGameState.GlobalPlay = false;
  myGameState.Paused = false;
  myGameState.PausedTimestamp = false;
  myGameState.GameOver = false;
  myGameState.Falling = false;
  myGameState.Falling_Enemy = false;
  myGameState.myName = false;
  myGameState.myScore = 0;
  myGameState.myLastScore = 1;
  myGameState.myEnemyScore = 0;
  myGameState.myEnemyLastScore = 1;
  myGameState.StartGameTimestamp = null;
  myGameState.enemy_visibility = true;
  
  myAnimationValues.myLastTimestamp = null;
  myAnimationValues.AnimationFrameHandle = null;
  myAnimationValues.last = null;
  
  Config.Speed = 0.001;
  Config.CollapsingSpeed = 0.003;
  Config.ZoomSpeed = 0.005;
  Config.LastLevel = 0;
  
  CurrentElement.Timestamp = 0;
  CurrentElement.XPos = 0;
  CurrentElement.YPos = 0;
  CurrentElement.Shape = 0;
  CurrentElement.Color = 0;
  CurrentElement.Rotation = 0;
  CurrentElement.TimeZoomButtonHeldTotal = 0;
  CurrentElement.ZoomButtonHeld = false;
  CurrentElement.NextElement = Math.floor(Math.random()*7);
  CurrentElement.NextColor = Math.floor(Math.random()*5)+1;
  
  CurrentElement_Enemy.Timestamp = 0;
  CurrentElement_Enemy.XPos = 0;
  CurrentElement_Enemy.YPos = 0;
  CurrentElement_Enemy.Shape = -1;
  CurrentElement_Enemy.Color = 0;
  CurrentElement_Enemy.Rotation = 0;
  CurrentElement_Enemy.TimeZoomButtonHeldTotal = 0;
  CurrentElement_Enemy.ZoomButtonHeld = false;
  CurrentElement_Enemy.NextElement = Math.floor(Math.random()*7);
  CurrentElement_Enemy.NextColor = Math.floor(Math.random()*5);
}


/*
Object containing references to the canvases.

All of these canvases except myBufferCanvas will be drawn to myBufferCanvas.

myBufferCanvas will be drawn to myKetrisCanvas, which is the only canvas displayed
to the players.
*/
const myDOMHandles = {
  KetrisImage: new Image(),
  myBufferCanvas: null, //Canvas which all other canvases will be drawn to before
                        //finally this canvas is drawn to the displayed canvas.
  myBackgroundCanvas: null, //Where the background image is stored.
  myMenuCanvas: null, //Where the menu image is stored.
  myScoreCanvas: null, //Where the score image is stored.
  myEnemyScoreCanvas : null, //Where the enemy score image is stored.
  myPlayerCanvas: null, //Where the player's gameplay area image is stored.
  myEnemyCanvas: null //Where the enemy's gameplay area image is stored.
}


/*
Object containing global variables.
*/
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


/*
Object containing global variables.
*/
const myAnimationValues = {
  myLastTimestamp: null,
  AnimationFrameHandle: null,
  last: null
}

/*
Object containing global variables for speed of falling objects.
*/
const Config = {
  Speed: 0.001,
  CollapsingSpeed: 0.003,
  ZoomSpeed: 0.005,
  LastLevel: 0
};


/*
Object containing global variables for the current and next shapes.
*/
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


/*
Object containing global variables for the enemy's current and next shapes.
*/
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