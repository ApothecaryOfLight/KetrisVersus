'use strict';

/*
Launch the Websocket connection to the game server.

inIPAddress: IP address of the game server.

inGameID: Game ID of the game session being launched.
*/
function doLaunchWebsocket( inIPAddress, inGameID ) {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    connection = new WebSocket( inIPAddress + ":3003" );
    connection.onclose = (event) => {
        console.log( "Websocket connection closed!" );
        console.dir( event );

        document.removeEventListener("visibilitychange", on_visibility_change);
    }
    connection.onopen = function () {
        console.log( "Connected to Ketris server!" );
        connection.send( JSON.stringify({
            type: "game_event",
            event: "client_start_ketris",
            game_id: inGameID
        }));

        document.addEventListener("visibilitychange", on_visibility_change);
    }
    connection.onerror = function (error) {
        console.error( "There has been an error." );
        console.error( error );
    }
    connection.onmessage = function (message) {
        let inPacket;
        try {
            inPacket = JSON.parse( message.data );
        } catch (error) {
            console.log( error );
            console.dir( inPacket );
            return;
        }
        if( inPacket.type === 'game_event' ) {
            if( inPacket.event === "ping" ) {
                connection.send( JSON.stringify({
                    type: "game_event",
                    event: "pong"
                }));
            } else if( inPacket.event === 'server_end_game' ) {
                console.log( "Ending game packet recieved." );
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
                CurrentElement_Enemy.Shape = inPacket.Shape;
                CurrentElement_Enemy.Rotation = inPacket.Rotation;
                CurrentElement_Enemy.Color = inPacket.Color;
                CurrentElement_Enemy.XPos = inPacket.XPos;
                CurrentElement_Enemy.YPos = inPacket.YPos;
                CurrentElement_Enemy.Timestamp = inPacket.Timestamp;
                CurrentElement_Enemy.NextElement = inPacket.NextElement;
                CurrentElement_Enemy.NextColor = inPacket.NextColor;
            } else if( inPacket.event === 'server_collision' ) {
                CurrentElement_Enemy.Shape = inPacket.Shape;
                CurrentElement_Enemy.Rotation = inPacket.Rotation;
                CurrentElement_Enemy.Color = inPacket.Color;
                CurrentElement_Enemy.XPos = inPacket.XPos;
                CurrentElement_Enemy.YPos = inPacket.YPos;
                CurrentElement_Enemy.Timestamp = inPacket.Timestamp;
                doTransposeElement_Enemy();
            } else if( inPacket.event === 'server_movement' ) {
                if( inPacket.direction == 'left' ) {
                    CurrentElement_Enemy.XPos--;
                } else if( inPacket.direction == 'right' ) {
                    CurrentElement_Enemy.XPos++;
                }
            } else if( inPacket.event === 'server_score' ) {
                myGameState.myEnemyScore = inPacket.score;
            } else if( inPacket.event === 'server_rotation' ) {
                CurrentElement_Enemy.Rotation = inPacket.rotation;
            } else if( inPacket.event === 'server_pause' ) {
                doReceivePause();
            } else if( inPacket.event === 'server_unpause' ) {
                doReceiveUnpause();
            } else if ( inPacket.event === 'server_visible' ) {
                doReceiveVisible();
            } else if ( inPacket.event === 'server_hidden' ) {
                doReceiveHidden();
            } else if( inPacket.event === 'server_restart' ) {
                doStartNewGame();
            } else if( inPacket.event === 'server_disconnect' ) {
                doEndKetrisGameplayer();
                connection.close();
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