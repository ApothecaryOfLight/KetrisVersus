let connection;
function doLaunchWebsocket( inIPAddress, inGameID ) {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    connection = new WebSocket( inIPAddress + ":3003" );
    connection.onopen = function () {
    console.log( "Connected to Ketris server!" );
    connection.send( JSON.stringify({
        type: "game_event",
        event: "client_start_ketris",
        game_id: inGameID
    }));
    }
    connection.onerror = function (error) {
    console.log( "There has been an error." );
    }
    connection.onmessage = function (message) {
    //console.log( "Ketris message recieved." );
    let inPacket;
    try {
        inPacket = JSON.parse( message.data );
    } catch (error) {
        console.log( error );
        console.dir( inPacket );
        //console.log( 'Invalid JSON: ', message.data );
        return;
    }
    //console.dir( inPacket );
    if( inPacket.type === 'game_event' ) {
        if( inPacket.event === 'server_end_game' ) {
        //console.log( "Ending game packet recieved." );
        myGameState.GameOver = true;
        myGameState.GlobalPlay = false;
        doComposeMenu( 10, 3, 0 );
        DrawMenu = true;
        } else if( inPacket.event === 'server_commence_gameplay' ) {
        doLaunchKetrisGameplayer();
        if( document.visibilityState == "hidden" ) {
            console.log( "Game hidden at initialization" );
            doSendHidden();
            doPause();
        }
        } else if( inPacket.event === 'server_new_shape' ) {
        //console.log( "New shape event from opponent." );
        CurrentElement_Enemy.Shape = inPacket.Shape;
        CurrentElement_Enemy.Rotation = inPacket.Rotation;
        CurrentElement_Enemy.Color = inPacket.Color;
        CurrentElement_Enemy.XPos = inPacket.XPos;
        CurrentElement_Enemy.YPos = inPacket.YPos;
        CurrentElement_Enemy.Timestamp = inPacket.Timestamp;
        CurrentElement_Enemy.NextElement = inPacket.NextElement;
        CurrentElement_Enemy.NextColor = inPacket.NextColor;
        } else if( inPacket.event === 'server_collision' ) {
        //console.log( "Colission recieved" );
        CurrentElement_Enemy.Shape = inPacket.Shape;
        CurrentElement_Enemy.Rotation = inPacket.Rotation;
        CurrentElement_Enemy.Color = inPacket.Color;
        CurrentElement_Enemy.XPos = inPacket.XPos;
        CurrentElement_Enemy.YPos = inPacket.YPos;
        CurrentElement_Enemy.Timestamp = inPacket.Timestamp;
        doTransposeElement_Enemy();
        } else if( inPacket.event === 'server_movement' ) {
        //console.log( "Movement recieved" );
        if( inPacket.direction == 'left' ) {
            CurrentElement_Enemy.XPos--;
        } else if( inPacket.direction == 'right' ) {
            CurrentElement_Enemy.XPos++;
        }
        } else if( inPacket.event === 'server_score' ) {
        //console.log( "Score recieved." );
        myGameState.myEnemyScore = inPacket.score;
        } else if( inPacket.event === 'server_rotation' ) {
        //console.log( "Rotation recieved" );
        CurrentElement_Enemy.Rotation = inPacket.rotation;
        } else if( inPacket.event === 'server_pause' ) {
        console.log( "pause recieved" );
        doReceivePause();
        } else if( inPacket.event === 'server_unpause' ) {
        console.log( "unpause recieved" );
        doReceiveUnpause();
        //doUnpause();
        } else if ( inPacket.event === 'server_visible' ) {
        console.log( "Recieved visible" );
        doReceiveVisible();
        } else if ( inPacket.event === 'server_hidden' ) {
        console.log( "Recieved hidden" );
        doReceiveHidden();
        } else if( inPacket.event === 'server_restart' ) {
        doStartNewGame();
        } else if( inPacket.event === 'server_disconnect' ) {
        let game_interface = document.getElementById('game_interface');
        let chat_interface = document.getElementById('chat_interface');
        game_interface.style.display = "none";
        chat_interface.style.display = "flex";
        document.removeEventListener( 'visibilitychange', on_visibility_change );
        //TODO: Close websocket.
        return;
        }
    } else {
        console.dir(
        'Illegal json data recieved:',
        inPacket
        );
    }
    };
}