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