'use strict'


/*
Function to switch between the three main interfaces of Ketris.

targetInterface: Desired interface to display.

websocket: Chat server connection.
*/
function switchInterface( targetInterface, websocket ) {
    try {
        //Get references to each interface.
        let login_interface = document.getElementById('login_interface');
        let chat_interface = document.getElementById('chat_interface');
        let game_interface = document.getElementById('game_interface');

        //Based on the interface specified:
        if( targetInterface == "game" ) {
            //Hide non-game interfaces.
            login_interface.style.display = "none";
            chat_interface.style.display = "none";
            game_interface.style.display = "flex";

            //Attach game events, detach chat and login events.
            attachGameEvents();
            detachChatEvents( websocket );
            detachLoginEvents( websocket );
        } else if( targetInterface == "chat" ) {
            //Hide non-chat interfaces.
            login_interface.style.display = "none";
            chat_interface.style.display = "flex";
            game_interface.style.display = "none";

            //Attach chat events, detach game and login events.
            detachWebsocketEvents( websocket );
            attachChatEvents( websocket );
            detachLoginEvents( websocket );
            detachGameEvents();
        } else if( targetInterface == "login" ) {
            //Hide non-login interfaces.
            login_interface.style.display = "flex";
            chat_interface.style.display = "none";
            game_interface.style.display = "none";

            //Attach login events, detach game and chat events.
            attachWebsocketEvents( websocket );
            attachLoginEvents( websocket );
            detachChatEvents( websocket );
            detachGameEvents();
        }
    } catch( error ) {
        console.error( error );
    }
}