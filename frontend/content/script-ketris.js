//TODO: Fix rotation in cases where the rotation will overlap blocks!!!
//TODO: Increasing speed rate
//TODO: Integrate pause and increased speed rate
//TODO: User system
//TODO: Highscore system
//TODO: Fix pause

function launchKetris( inIPAddress, inGameID ) {
	console.log( "Connection to server " + inIPAddress + " for game " + inGameID + "." );
	console.log( "Launching Ketris." );

	document.addEventListener("visibilitychange", function() {
		console.log( document.visibilityState );
		if( document.visibilityState == "hidden" ) {
			doPause();
		} else if( document.visibilityState == "visible" ) {
			doUnpause();
		}
	});

///////////////////////////////////////////////////////////////////////////
//  Global Letiables  /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

	//Grid letiables
	let KetrisGrid = [[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,4 ],
		[ 0,0,0,0,0,1,0,0,0,4 ],[ 0,0,0,0,1,1,1,0,4,4 ]];
	let FallingGrid = [[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ]];
	let FallingColorGrid = [[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ]];
	let KetrisGrid_Enemy = [[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,4 ],
		[ 0,0,0,0,0,1,0,0,0,4 ],[ 0,0,0,0,1,1,1,0,4,4 ]];
	let FallingGrid_Enemy = [[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ]];
	let FallingColorGrid_Enemy = [[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0,0 ],[ 0,0,0,0,0,0,0,0,0,0 ]];
	//Constants
	const Shapes = [
		[
			[ [1,0,0,0], [1,0,0,0], [1,0,0,0], [1,0,0,0] ],
			[ [1,1,1,1], [0,0,0,0], [0,0,0,0], [0,0,0,0] ],
			[ [1,0,0,0], [1,0,0,0], [1,0,0,0], [1,0,0,0] ],
			[ [1,1,1,1], [0,0,0,0], [0,0,0,0], [0,0,0,0] ]
		],
		[
			[ [0,1,0,0], [0,1,0,0], [1,1,0,0], [0,0,0,0] ],
			[ [1,0,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0] ],
			[ [1,1,0,0], [1,0,0,0], [1,0,0,0], [0,0,0,0] ],
			[ [1,1,1,0], [0,0,1,0], [0,0,0,0], [0,0,0,0] ]
		],
		[
			[ [1,0,0,0], [1,0,0,0], [1,1,0,0], [0,0,0,0] ],
			[ [1,1,1,0], [1,0,0,0], [0,0,0,0], [0,0,0,0] ],
			[ [1,1,0,0], [0,1,0,0], [0,1,0,0], [0,0,0,0] ],
			[ [0,0,1,0], [1,1,1,0], [0,0,0,0], [0,0,0,0] ]
		],
		[
			[ [1,1,0,0], [1,1,0,0], [0,0,0,0], [0,0,0,0] ],
			[ [1,1,0,0], [1,1,0,0], [0,0,0,0], [0,0,0,0] ],
			[ [1,1,0,0], [1,1,0,0], [0,0,0,0], [0,0,0,0] ],
			[ [1,1,0,0], [1,1,0,0], [0,0,0,0], [0,0,0,0] ]
		],
		[
			[ [1,1,0,0], [0,1,1,0], [0,0,0,0], [0,0,0,0] ],
			[ [0,1,0,0], [1,1,0,0], [1,0,0,0], [0,0,0,0] ],
			[ [1,1,0,0], [0,1,1,0], [0,0,0,0], [0,0,0,0] ],
			[ [0,1,0,0], [1,1,0,0], [1,0,0,0], [0,0,0,0] ]
		],
		[
			[ [0,1,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0] ],
			[ [1,0,0,0], [1,1,0,0], [1,0,0,0], [0,0,0,0] ],
			[ [1,1,1,0], [0,1,0,0], [0,0,0,0], [0,0,0,0] ],
			[ [0,1,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0] ]
		],
		[
			[ [0,1,1,0], [1,1,0,0], [0,0,0,0], [0,0,0,0] ],
			[ [1,0,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0] ],
			[ [0,1,1,0], [1,1,0,0], [0,0,0,0], [0,0,0,0] ],
			[ [1,0,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0] ]
		]
	];
	let myDOMHandles = {
		//content: $('#content'),
		//input: $('#input'),
		KetrisImage: new Image(),
		myBackgroundCanvas: null,
		myPlayCanvas: null,
		myMenuCanvas: null,
		myScoreCanvas: null,
		myEnemyScoreCanvas : null
	}
	let myGameState = {
		GlobalPlay: false,
		Paused: false,
		PausedTimestamp: false,
		GameOver: false,
		Falling: false,
		Falling_Enemy: false,
		myName: false,//TODO: This is awkward and unncessesary.
		myScore: 0,
		myLastScore: 1,
		myEnemyScore: 0,
		myEnemyLastScore: 1,
		StartGameTimestamp: null
	}
	//Global configuration letiables TODO: Sync with server
	let myAnimationValues = {
		myLastTimestamp: null,
		AnimationFrameHandle: null,
		last: null
	}
	let Config = {
		Speed: 0.001,
		CollapsingSpeed: 0.003,
		ZoomSpeed: 0.005,
		LastLevel: 0
	};
	let CurrentElement = {
		Timestamp: 0,
		XPos: 0,
		YPos: 0,
		Shape: 0,
		Color: 0,
		Rotation: 0,
		TimeZoomButtonHeldTotal: 0,
		ZoomButtonHeld: false,
		NextElement: Math.floor(Math.random()*7),
		NextColor: Math.floor(Math.random()*5)
	};
	let CurrentElement_Enemy = {
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

	window.WebSocket = window.WebSocket || window.MozWebSocket;
	let connection = new WebSocket( 'ws://34.222.250.86:1337' );
	connection.onopen = function () {
		console.log( "New connection!" );
		connection.send( JSON.stringify({
			type: "game_event",
			event: "start_ketris",
			game_id: inGameID
		}));
        }
	connection.onerror = function (error) {
		console.log( "There has been an error." );
	}
	connection.onmessage = function (message) {
		console.log( "Ketris message recieved." );
		let inPacket;
		try {
			inPacket = JSON.parse( message.data );
		} catch (error) {
			console.log( error );
			console.dir( inPacket );
			//console.log( 'Invalid JSON: ', message.data );
			return;
		}
		console.dir( inPacket );
		if( inPacket.type === 'game_event' ) {
			if( inPacket.event === 'end_game' ) {
				//console.log( "Ending game packet recieved." );
				myGameState.GameOver = true;
				myGameState.GlobalPlay = false;
				doComposeMenu( 10, 3, 0 );
				DrawMenu = true;
			} else if( inPacket.event === 'commence_gameplay' ) {
				doLaunchKetrisGameplayer();
			} else if( inPacket.event === 'new_shape' ) {
				//console.log( "New shape event from opponent." );
				CurrentElement_Enemy.Shape = inPacket.Shape;
				CurrentElement_Enemy.Rotation = inPacket.Rotation;
				CurrentElement_Enemy.Color = inPacket.Color;
				CurrentElement_Enemy.XPos = inPacket.XPos;
				CurrentElement_Enemy.YPos = inPacket.YPos;
				CurrentElement_Enemy.Timestamp = inPacket.Timestamp;
				CurrentElement_Enemy.NextElement = inPacket.NextElement;
				CurrentElement_Enemy.NextColor = inPacket.NextColor;
			} else if( inPacket.event === 'collision' ) {
				//console.log( "Colission recieved" );
				CurrentElement_Enemy.Shape = inPacket.Shape;
				CurrentElement_Enemy.Rotation = inPacket.Rotation;
				CurrentElement_Enemy.Color = inPacket.Color;
				CurrentElement_Enemy.XPos = inPacket.XPos;
				CurrentElement_Enemy.YPos = inPacket.YPos;
				CurrentElement_Enemy.Timestamp = inPacket.Timestamp;
				doTransposeElement_Enemy();
			} else if( inPacket.event === 'movement' ) {
				//console.log( "Movement recieved" );
				if( inPacket.direction == 'left' ) {
					CurrentElement_Enemy.XPos--;
				} else if( inPacket.direction == 'right' ) {
					CurrentElement_Enemy.XPos++;
				}
			} else if( inPacket.event === 'score' ) {
				//console.log( "Score recieved." );
				myGameState.myEnemyScore = inPacket.score;
			} else if( inPacket.event === 'rotation' ) {
				//console.log( "Rotation recieved" );
				CurrentElement_Enemy.Rotation = inPacket.rotation;
			} else if( inPacket.event === 'pause' ) {
				//console.log( "pause recieved" );
				myGameState.PausedTimestamp = Date.now();
				myGameState.Paused = true;
			} else if( inPacket.event === 'unpause' ) {
				//console.log( "unpause recieved" );
				myGameState.Paused = false;
				CurrentElement.Timestamp +=
					Date.now()-myGameState.PausedTimestamp;
				CurrentElement_Enemy.Timestamp +=
					Date.now()-myGameState.PausedTimestamp;
			} else if( inPacket.event === 'restart' ) {
				doStartNewGame();
			}
		} else {
			console.log(
				'Illegal json data recieved:',
				inPacket
			);
		}
	};
	setInterval( function() {
		if( connection.readyState !== 1 ) {
			myDOMHandles.input.attr( 'disabled', 'disabled' ).val(
				'Unable to communicate with the server.'
			);
		}
	}, 3000 );
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
			window.requestAnimationFrame( doManageDrawing );
		}
	}
	function doLaunchKetrisGameplayer() {
		console.log( "Launching Ketris Gameplayer." );
		myDOMHandles.KetrisImage.src = "spritesheet_mod.png";
		myDOMHandles.KetrisImage.onload = function() {
			console.log( "Images loaded.");
			myDOMHandles.myBackgroundCanvas = document.createElement("canvas");
			myDOMHandles.myBackgroundCanvas.width = 313*2;
			myDOMHandles.myBackgroundCanvas.height = 749;

			myDOMHandles.myPlayCanvas = document.createElement("canvas");
			myDOMHandles.myPlayCanvas.width = 313*2;
			myDOMHandles.myPlayCanvas.height = 749;

			myDOMHandles.myMenuCanvas = document.createElement("canvas");
			myDOMHandles.myMenuCanvas.width = 313*2;
			myDOMHandles.myMenuCanvas.height = 749;

			myDOMHandles.myScoreCanvas = document.createElement("canvas");
			myDOMHandles.myScoreCanvas.width = 10*15;
			myDOMHandles.myScoreCanvas.height = 16;

			myDOMHandles.myEnemyScoreCanvas = document.createElement("canvas");
			myDOMHandles.myEnemyScoreCanvas.width = 10*15;
			myDOMHandles.myEnemyScoreCanvas.height = 16;

			doComposeBackground();

			//TODO: Put in an initial start button.
			doStartNewGame();

			myAnimationValues.AnimationFrameHandle =
				window.requestAnimationFrame( doManageDrawing );
			//doManageDrawing();
			//timerDraw = setInterval( doDraw, 10 );
		};
	}
	function doSendMovementLeft() {
		if( myGameState.GlobalPlay == true ) {
			//console.log( "Do sending move left event." );
			let doMoveElementLeft = JSON.stringify(
				{ type: "event",
				event: "movement",
				direction: "left" }
			);
			connection.send( doMoveElementLeft );
		}
	}
	function doSendMovementRight() {
		if( myGameState.GlobalPlay == true ) {
			//console.log( "Do sending move right event." );
			let doMoveElementRight = JSON.stringify(
				{ type: "event",
				event: "movement",
				direction: "right" }
			);
			connection.send( doMoveElementRight );
		}
	}
	function doSendRotation( inRotation ) {
		if( myGameState.GlobalPlay == true ) {
			let newRotation = JSON.stringify(
				{ type: "event",
				event: "rotation",
				rotation: inRotation }
			);
			connection.send( newRotation );
		}
	}
	function doSendCollisionEvent( inYOffset ) {
		if( myGameState.GlobalPlay == true ) {
			/*console.log(
				"Do sending collision event with yoffset of " +
				inYOffset
			);*/
			let newElementCollision = JSON.stringify(
				{ type: "event",
				event: "collision",
				Shape: CurrentElement.Shape,
				Rotation: CurrentElement.Rotation,
				Color: CurrentElement.Color,
				Timestamp: CurrentElement.Timtamp,
				XPos: CurrentElement.XPos,
				YPos: (CurrentElement.YPos+inYOffset) }
			);
			connection.send( newElementCollision );
		}
	}
	function doSendNewElement() {
		let newElementOut = JSON.stringify(
			{
				type: "event",
				event: "new_shape",
				Shape: CurrentElement.Shape,
				Rotation: CurrentElement.Rotation,
				Color: CurrentElement.Color,
				Timestamp: CurrentElement.Timestamp,
				XPos: CurrentElement.XPos,
				YPos: CurrentElement.YPos
			}
		);
		connection.send( newElementOut );
	}
	function doGenerateNextElement() {
		CurrentElement.Shape = CurrentElement.NextElement;
		CurrentElement.Color = CurrentElement.NextColor;
		CurrentElement.Rotation = Math.floor(Math.random()*4);

		if( isShapeSpawnable (
			CurrentElement.Shape,
			CurrentElement.Rotation
		) == false ) {
			doComposeMenu( 10, 3, 0 );
			DrawMenu = true;
			return;
		}
		CurrentElement.XPos = 5;
		CurrentElement.YPos = 0;
		CurrentElement.Timestamp = Date.now();
		CurrentElement.LastLevel = 0;
		CurrentElement.NextElement = Math.floor(Math.random()*7);
		CurrentElement.NextColor = Math.floor(Math.random()*5)+1;
		doSendNewElement();
	}
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
	function doGravity( inX, inY ) {
		let FallingTimestamp = Date.now();
		for( let y=inY; y>0; y-- ) {
			if( KetrisGrid[y][inX] != 0 ) {
				FallingGrid[y][inX] = FallingTimestamp;
				FallingColorGrid[y][inX] = KetrisGrid[y][inX];
				KetrisGrid[y][inX] = 0;
			}
			myGameState.Falling = true;
		}
	}
	function doLineElimination( inLineNumber ) {
		let isOneColor = KetrisGrid[inLineNumber][0];
		for( let x=0; x<10; x++ ) {
			if( isOneColor != KetrisGrid[inLineNumber][x] ) {
				isOneColor = -1;
			}
			KetrisGrid[inLineNumber][x] = 0;
			doGravity( x, inLineNumber );
		}
		if( isOneColor == -1 ) {
			myGameState.myScore += 10;
		} else {
			myGameState.myScore += 100;
		}
	}
	function doCheckLine( inLineNumber ) {
		for( let x=0; x<10; x++ ) {
			if( KetrisGrid[inLineNumber][x] == 0 ) {
				return true;
			}
		}
		return false;
	}
	function doCheckForLineElimination() { //TODO: Implement multiline wins
		let Rerun = false;
		for( let y=0; y<20; y++ ) {
			if( doCheckLine( y ) == false ) {
				Rerun = true;
				doLineElimination( y );
			}
		}	//TODO: Implement patterns
		if( Rerun == true ) {
			doCheckForLineElimination();
		}
	}
	function doTransposeElement() {
		let Shape = CurrentElement.Shape;
		let Rotation = CurrentElement.Rotation;
		let Color = CurrentElement.Color;

		let xOffset = Math.floor( CurrentElement.XPos );

		let Elapsed = Date.now() -
			CurrentElement.Timestamp;
		let yOffset = Math.floor( Math.floor( Config.Speed * Elapsed ) );

		for( let y=0; y<4; y++ ) {
			for( let x=0; x<4; x++ ) {
				if( Shapes[Shape][Rotation][x][y] == 1 ) {
					if( KetrisGrid[yOffset+y][xOffset+x] != 0 ) {
						return false;
					}
					KetrisGrid[yOffset+y][xOffset+x] = Color;
				}
			}
		}

		doCheckForLineElimination();
		doGenerateNextElement();
		doCheckForCollision();

		return true;
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
	function doElementDrop() {
		if( myGameState.Falling == false && myGameState.GlobalPlay == true ) {
			let Shape = CurrentElement.Shape;
			let Rotation = CurrentElement.Rotation;
			let Color = CurrentElement.Color;
			let xOffset = Math.floor( CurrentElement.XPos );
			let yOffset = Math.floor(
				( Date.now() -
				CurrentElement.Timestamp ) *
				Config.Speed
			);

			while( isCollision(
				Shape,
				Rotation,
				xOffset,
				yOffset
			) == false ) {
				yOffset += 1;
			}
	
			doSendCollisionEvent( yOffset );
			for( let y=0; y<4; y++ ) {
				for( let x=0; x<4; x++ ) {
					if( Shapes[Shape][Rotation][x][y] == 1 ) {
						if( KetrisGrid[yOffset+y][xOffset+x] != 0 )
						{
							return false;
						}
						KetrisGrid[yOffset+y][xOffset+x] = Color;
					}
				}
			}
			doCheckForLineElimination();
			doGenerateNextElement();
			doCheckForCollision();
		}
	}
	function doFallingBlocksLogic() {
		let RealPosition;
		let BlocksStillFalling = false;
		for( let x=0; x<10; x++ ) {
			for( let y=0; y<20; y++ ) {
				if( FallingGrid[y][x] != 0 ) {
					RealPosition = (Config.CollapsingSpeed*
						(Date.now()-FallingGrid[y][x]))+y+0.4;
					BlocksStillFalling = true;
					if( RealPosition+0.6 >= 20 ) {
						FallingGrid[y][x] = 0;
						KetrisGrid[19][x] = FallingColorGrid[y][x];
						FallingColorGrid[y][x] = 0;
						BlocksStillFalling = false;
						doCheckForLineElimination();
					} else if( KetrisGrid[
						Math.round(RealPosition)][x] != 0  ||
						RealPosition+0.6 >= 20 )
					{
						FallingGrid[y][x] = 0;
						KetrisGrid[Math.floor(RealPosition)][x] =
							FallingColorGrid[y][x];
						FallingColorGrid[y][x] = 0;
						BlocksStillFalling = false;
						doCheckForLineElimination();
					}
				}
			}
		}
		if( BlocksStillFalling == true ) {
			myGameState.Falling = true;
			CurrentElement.Timestamp = Date.now();
		}
		else if( BlocksStillFalling == false ) {
			myGameState.Falling = false;
		}
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


/////////////////////////////////////////////////////////////////////////////
//  Animation Functions /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
	function doDraw() {
		//console.log( "doDraw" );
		let myCanvas = document.getElementById( "myKetrisCanvas" );
		let myCanvasContext = myCanvas.getContext( "2d" );
		myCanvasContext.clearRect(
			0, 0, myCanvas.width, myCanvas.height
		);

		let myPlayCanvasContext = myDOMHandles.myPlayCanvas.getContext( "2d" );
		myPlayCanvasContext.clearRect(
			0, 0, myDOMHandles.myPlayCanvas.width, myDOMHandles.myPlayCanvas.height
		);
		doDrawBackground();
		doDrawKetrisBlocks();
		doDrawScore();
		doDrawEnemyScore();
		doDrawPreviewBlock();
		if( myGameState.GlobalPlay == true && myGameState.GameOver == false ) {
			if( myGameState.Falling == false ) { doDrawGhostblock(); }
			doDrawCurrentElement();
		}
		myCanvasContext.drawImage( myDOMHandles.myPlayCanvas, 0, 0 );
		if( DrawMenu == true ) {
			doDrawMenu();
		}
		let TimeElapsed = Date.now() - myGameState.StartGameTimestamp;
		//Config.Speed = 0.001 + ( TimeElapsed/50000000 );
	}
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
	function doDrawBackground() {
		let myPlayCanvasContext = myDOMHandles.myPlayCanvas.getContext( "2d" );
		myPlayCanvasContext.drawImage( myDOMHandles.myBackgroundCanvas, 0, 128 );
		myPlayCanvasContext.drawImage( myDOMHandles.myBackgroundCanvas,
			0, 0,
			313, 621,
			313, 128,
			313, 621
		);	
	}
	function doDrawGhostblock() {
		let myPlayCanvasContext = myDOMHandles.myPlayCanvas.getContext( "2d" );
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
	function doDrawCurrentElement() {
		let myPlayCanvasContext = myDOMHandles.myPlayCanvas.getContext( "2d" );
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
		if( myGameState.Falling_Enemy == true ) { Elapsed_Enemy = Date.now(); }
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
						myPlayCanvasContext.drawImage(
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
							myPlayCanvasContext.drawImage(
								myDOMHandles.KetrisImage,
								(CurrentElement_Enemy.Color-
									1)*32, 0, 32, 32,
								((xOffset_Enemy+x)*31)+313,
								((yOffset_Enemy+y)*31)+128,
								32, 32
							);
						}
					}
				}
			}
		}
	}
	function doDrawKetrisBlocks() {
		let myPlayCanvasContext = myDOMHandles.myPlayCanvas.getContext( "2d" );
		doFallingBlocksLogic();
		doFallingBlocksLogic_Enemy();
		for( let x=0; x<10; x++ ) {
			for( let y=0; y<20; y++ ) {
				if( KetrisGrid[y][x] != 0  && FallingGrid[y][x] == 0 ) {
					myPlayCanvasContext.drawImage(
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
					myPlayCanvasContext.drawImage(
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
					myPlayCanvasContext.drawImage(
						myDOMHandles.KetrisImage,
						(KetrisGrid_Enemy[y][x]-1)*32, 0,
						32, 32,
						(x*31)+313, (y*31)+128,
						32, 32
					);
				}
				if( FallingGrid_Enemy[y][x] != 0 ) {
					let RealPosition = ( Config.CollapsingSpeed *
						(Date.now()-FallingGrid_Enemy[y][x]))+y;
					myPlayCanvasContext.drawImage(
						myDOMHandles.KetrisImage,
						(FallingColorGrid_Enemy[y][x]-1)*32, 0,
						32, 32,
						(x*31)+313, ((RealPosition)*31)+128,
						32, 32
					);
				}
			}
		}
	}
	function doComposeScore( inNumber, inPlace ) {
		//console.log( "Do compose score." );
		let myScoreCanvasContext = myDOMHandles.myScoreCanvas.getContext( "2d" );
		myScoreCanvasContext.drawImage(
			myDOMHandles.KetrisImage,
			inNumber*11, 500,
			10, 16,
			(inPlace*11), 0,
			10, 16
		);
	}
	function doSendScoreUpdate() { //bookmark
		let score = JSON.stringify(
			{ type: "event",
			event: "score",
			score: myGameState.myScore }
		);
		connection.send( score );
	}
	function doDrawScore() {
		if( myGameState.myLastScore != myGameState.myScore ) {
			myGameState.myLastScore = myGameState.myScore;
			//console.log( "Score update: " + myGameState.myScore + "." );

			doSendScoreUpdate();//TODO: Implement enemy scoring

			let myScoreCanvasContext =
				myDOMHandles.myScoreCanvas.getContext( "2d" );
			myScoreCanvasContext.clearRect(
				0, 0,
				myDOMHandles.myScoreCanvas.width, myDOMHandles.myScoreCanvas.height
			);

			let myScore = myGameState.myScore.toString();
			for( let myDigitKey in myScore ) {
				/*console.log( "doDrawScore " + myScore[myDigitKey] +
					" in " + myDigitKey + "th place." );*/
				doComposeScore( myScore[myDigitKey], myDigitKey );
			}
		}
		let myPlayCanvasContext = myDOMHandles.myPlayCanvas.getContext( "2d" );
		let myScoreCanvasContext = myDOMHandles.myScoreCanvas.getContext( "2d" );
//console.log( myScoreCanvas.width );
		myPlayCanvasContext.drawImage(
			myDOMHandles.myScoreCanvas,
			0, 0,
			myDOMHandles.myScoreCanvas.width, myDOMHandles.myScoreCanvas.height,
			25, 25,
			myDOMHandles.myScoreCanvas.width, myDOMHandles.myScoreCanvas.height
		);
	}
	function doComposeEnemyScore( inNumber, inPlace ) {
		//console.log( "Do compose enemy score." );
		let myEnemyScoreCanvasContext = myDOMHandles.myEnemyScoreCanvas.getContext( "2d" );
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
			//console.log( "Enemy score update: " + myGameState.myEnemyScore + "." );

			let myEnemyScoreCanvasContext =
				myDOMHandles.myEnemyScoreCanvas.getContext( "2d" );
			myEnemyScoreCanvasContext.clearRect(
				0, 0,
				myDOMHandles.myEnemyScoreCanvas.width, myDOMHandles.myEnemyScoreCanvas.height
			);

			let myEnemyScore = myGameState.myEnemyScore.toString();
			for( let myDigitKey in myEnemyScore ) {
				/*console.log( "doDrawScore " + myEnemyScore[myDigitKey] +
					" in " + myDigitKey + "th place." );*/
				doComposeEnemyScore( myEnemyScore[myDigitKey], myDigitKey );
			}
		}
		let myPlayCanvasContext = myDOMHandles.myPlayCanvas.getContext( "2d" );
		//let myEnemyScoreCanvasContext = myDOMHandles.myEnemyScoreCanvas.getContext( "2d" );
//console.log( myDOMHandles.myEnemyScoreCanvas.width );
		myPlayCanvasContext.drawImage(
			myDOMHandles.myEnemyScoreCanvas,
			0, 0,
			myDOMHandles.myEnemyScoreCanvas.width, myDOMHandles.myEnemyScoreCanvas.height,
			(25)+313, 25,
			myDOMHandles.myEnemyScoreCanvas.width, myDOMHandles.myEnemyScoreCanvas.height
		);
	}
	function doDrawPreviewBlock() {
		let toDrawShape = CurrentElement.NextElement;
		let toDrawColor = CurrentElement.NextColor;
		let myPlayCanvasContext = myDOMHandles.myPlayCanvas.getContext( "2d" );
		//myPlayCanvasContext.drawImage(
			//myDOMHandles.KetrisImage
		//);
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


/////////////////////////////////////////////////////////////////////////
//  Menu Functions  /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
	let StartGameButtonCanvas;
	let StartGameButtonCanvasContext;
	let DrawMenu = false;
	let MenuRedrawTimer;
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
	function doDrawMenu() {
		let myCanvas = document.getElementById( "myKetrisCanvas" );
		let myCanvasContext = myCanvas.getContext( "2d" );
		myCanvasContext.drawImage( StartGameButtonCanvas, 80, 296 );	
	}
	function doStartNewGame() {
		console.log( "Starting new game!" );
		Config.Speed = 0.001;
		myGameState.StartGameTimestamp = Date.now();
		//doGenerateNextElement();
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


//////////////////////////////////////////////////////////////////////////
//  Input Functions  /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
	function doLeftKeyPress() {
		if(
			isCurrentObjectOnScreenLeftHand() == true &&
			isLeftCollidable() == false
		) {
			CurrentElement.XPos -= 1;
			doSendMovementLeft();
			doCheckForCollision();
		}
	}
	function doRightKeyPress() {
		if(
			isCurrentObjectOnScreenRightHand() == true &&
			isRightCollidable() == false
		) {
			CurrentElement.XPos += 1;
			doSendMovementRight();
			doCheckForCollision();
		}
	}
	function doUpKeyPress() {
		if( isRotationAllowed( 
			CurrentElement.Shape,
			CurrentElement.Rotation,
			CurrentElement.Rotation+1,
			CurrentElement.XPos,
			CurrentElement.YPos
		) == true )
		{
			CurrentElement.Rotation += 1;
			if( CurrentElement.Rotation > 3 ) {
				CurrentElement.Rotation = 0 ;
			}
			doSendRotation( CurrentElement.Rotation );
		} else if( CurrentElement.XPos >= 8 ) {
			doProcessWallkicks();
		}
	}
	function doDownKeyPress() {
		doElementDrop();
	}
	function doPause() {
		console.log( "Pausing" );
		myGameState.PausedTimestamp = Date.now();
		myGameState.Paused = true;
		let pause = JSON.stringify({
			type: 'game-event',
			event: 'pause'
		});
		connection.send( pause );
	}
	function doUnpause() {
		console.log( "Unpausing" );
		myGameState.Paused = false;
		CurrentElement.Timestamp +=
		Date.now()-myGameState.PausedTimestamp;
		CurrentElement_Enemy.Timestamp +=
		Date.now()-myGameState.PausedTimestamp
		let unpause = JSON.stringify({
			type: 'game-event',
			event: 'unpause'
		});
		connection.send( unpause );
	}
	function doSpaceKeyPress() {
		console.log( "Space pressed." );
		if( myGameState.Paused == false ) {
			doPause();
		}
		else {
			//console.log("Unpausing...");
			doUnpause();
		}
		//doUnpause();
	}
	function doEscapeKeyPress () {
	}
	document.onkeydown = function(event) {
		if( myGameState.GlobalPlay == true ) {
			if( myGameState.Paused == false ) {
				if( event.which==37 ) { doLeftKeyPress(); }
				if( event.which==39 ) { doRightKeyPress(); }
				if( event.which==38 ) { doUpKeyPress(); }
				if( event.which==40 ) { doDownKeyPress(); }
			}
			if( event.which==27 ) { doEscapeKeyPress(); }
		}
	}
	document.onkeypress = function(event) {
		if( myGameState.GlobalPlay == true ) {
			if( event.which==32 ) { 
				event.stopPropagation();
				event.preventDefault();
				if( myGameState.GameOver == false ) { doSpaceKeyPress(); }
			}
			if( myGameState.Paused == false ) {
				if( event.which==49 || event.which==97 ) {
					doLeftKeyPress();
				}
				if( event.which==51 || event.which==100 ) {
					doRightKeyPress();
				}
				if( event.which==53 || event.which==119 ) {
					doUpKeyPress();
				}
				if( event.which==50 || event.which==115 ) {
					doDownKeyPress();
				}
			}
		}
	}
	function getCursorPosition( canvas, event ) {
		let x, y;
		let canoffset = $(myKetrisCanvas).offset();
		x = event.clientX + document.body.scrollLeft +
			document.documentElement.scrollLeft -
			Math.floor(canoffset.left);
		y = event.clientY + document.body.scrollTop +
			document.documentElement.scrollTop -
			Math.floor(canoffset.top) + 1;
		return [x,y];
	}
	window.onclick = function(e) {
		let out = getCursorPosition( myKetrisCanvas, e );
		if( myGameState.GlobalPlay == true ) {
			if( myGameState.Paused == false ) {
				if( out[0] < 313 ) {
					if( out[1] < (620/2) ) {
						doUpKeyPress();
					}
					if( out[1] > (620/2) && out[1] ) {
						if( out[0] < 310/3 ) {
							doLeftKeyPress();
						}
						if(
							out[0] > (310/3) &&
							out[0] < (310/3)*2
						) {
							doDownKeyPress();
						}
						if( out[0] > (310/3)*2 ) {
							doRightKeyPress();
						}
					}
				}
			}
		}
		if( myGameState.GameOver == true ) {
			console.log( "Click on Restart Game." );
			if( out[0] > 80 && out[0] < 240 ) {
				if( out[1] > 296 && out[1] < 344 ) {
					let restart = JSON.stringify(
						{ type: 'event', //TODO: Gameplay type
						event: 'restart' }
					);
					connection.send( restart );
					doStartNewGame();
				}
			}
		}
	}


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
							console.log( "Game over B!" );
							myGameState.GlobalPlay = false;
							myGameState.GameOver = true;
						
							let end_game = JSON.stringify(
								{ type: 'event',
								event: 'end_game' }
							);
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
}
