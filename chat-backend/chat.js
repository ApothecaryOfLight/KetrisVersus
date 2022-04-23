/*
This function iterates through all connected users, sending each the message
specified in in_message.
*/
function send_MessageToAll( users, in_message ) {
    users.forEach( user=> {
        if( Object.keys( user ).length != 0 ) {
            user.connection.send( JSON.stringify( in_message ) );
        }
    });
}
exports.send_MessageToAll = send_MessageToAll;


/*
This function iterates through all connected users except for the one specified
in except_id, sending all but that one user the message specified in in_message.
*/
function send_MessageToAllExcept( users, in_message, except_id ) {
    users.forEach( user=>{
        if( Object.keys( user ).length != 0 && user.user_id != except_id ) {
            user.connection.send( JSON.stringify( in_message ) );
        }
    });
}
exports.send_MessageToAllExcept = send_MessageToAllExcept;


/*
This function sends a message to the user specified in in_user_id.
*/
function send_MessageToUser( users, in_message, in_user_id ) {
    users[in_user_id].connection.send( JSON.stringify( in_message ) );
}
exports.send_MessageToUser = send_MessageToUser;



async function do_log_chat_message( myLogger, mySqlPool, myChatMessage, myWebsocketConnection ) {
    try {
        const insert_chat_message_query =
            'INSERT INTO ketris_messages ' +
            '( ' +
            'author_name, message_body, timestamp, ip ' +
            ') VALUES (' +
            '\'' + myChatMessage.username + '\', ' +
            '\'' + myChatMessage.text + '\', ' +
            '\'' + myChatMessage.timestamp + '\', ' +
            '\'' + myWebsocketConnection.ip + '\'' +
            ');'
        const [rows,fields] = await mySqlPool.query( insert_chat_message_query );
    } catch( error ) {
        //Log the error.
        const details_obj = {
            "username": myChatMessage.username,
            "chat_message": myChatMessage.text,
            "chat_timestamp": myChatMessage.timestamp,
            "chat_ip": myChatMessage,ip,
            "error": error_obj
        }
        logger.log_error(
            "do_log_chat_message()::catch",
            "Failed at logging chat message.",
            1,
            myWebsocketConnection.ip,
            details_obj
        );
    }
}
exports.do_log_chat_message = do_log_chat_message;