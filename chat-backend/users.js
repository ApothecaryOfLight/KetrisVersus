/*
This function is called after the user's credentials have been validated.
This adds the user to the chat server's listing of users,
calls functions to send this new user listings of other logged in users
and posted games, and then calls a function to send a notification to all
other logged in users that this new user has also logged in.
*/
async function do_approve_login( myLogger, new_user, inMessage, users, games, myWebsocketConnection, myUIDGen, send_GameList ) {
    try {
        new_user.username = inMessage.username;
        new_user.password = inMessage.password;
        new_user.user_id = myUIDGen.generate_uid( "users" );
        new_user.has_game = false;
        new_user.game_id = -1;
        users[new_user.user_id] = new_user;
        myWebsocketConnection.myConnection.sendUTF( "server_login_approved" );
        send_UserList( users, myWebsocketConnection.myConnection );
        send_GameList( myLogger, games, myWebsocketConnection );
        send_NewUserNotification( users, new_user.user_id );
    } catch( error_obj ) {
        console.error( error_obj );
        myLogger.log_error(
            "users.js::do_approve_login()::catch",
            "Error while approving login.",
            myWebsocketConnection.ip,
            error_obj
        );
    }
}
exports.do_approve_login = do_approve_login;


/*
Sends a message to the user that they failed to provide valid credentials.
*/
async function do_reject_login( logger, myWebsocketConnection ) {
    try {
        myWebsocketConnection.myConnection.sendUTF( "server_login_failed" );
    } catch( error_obj ) {
        myLogger.log_error(
            "users.js::do_reject_login()",
            "Error while rejecting login.",
            myWebsocketConnection.ip,
            error_obj
        );
    }
}
exports.do_reject_login = do_reject_login;
  

async function attempt_login ( logger, new_user, inMessage, users, games, mySqlPool, inUsername, inPassword, myWebsocketConnection, myUIDGen, send_GameList ) {
    try {
        const [rows,fields] = await mySqlPool.query(
        'SELECT * FROM ketris_users ' +
        'WHERE password_hash=UNHEX(MD5(\"' + inPassword + '\")) AND ' +
        'username_hash=UNHEX(MD5(\"'+inUsername+'\"));' );
        if( rows.length > 0 ) {
            do_approve_login( logger, new_user, inMessage, users, games, myWebsocketConnection, myUIDGen, send_GameList );
            const details_obj = {
                "username": inUsername,
                "password": inPassword
            }
            logger.log_event( "attempt_login()::try", "Successful login.", myWebsocketConnection.ip, details_obj );
        } else {
            do_reject_login( logger, myWebsocketConnection );
            const details_obj = {
                "username": inUsername,
                "password": inPassword
            }
            logger.log_event( "attempt_login()::try", "Failed login attempt was made.", myWebsocketConnection.ip, details_obj );
        }
    } catch( error_obj ) {
    doDeny( logger, myWebsocketConnection.myConnection );
        const details_obj = {
            "username": inUsername,
            "password": inPassword,
            "error": error_obj
        }
        logger.log_error(
            "attempt_login()::catch",
            "Failed login attempt was made.",
            1,
            myWebsocketConnection.ip,
            details_obj
        );
    }
}
exports.attempt_login = attempt_login;
  

  async function attempt_create_user( logger, mySqlPool, user, pass, conn, req ) {
    try {
      const insert_query = 'INSERT INTO ketris_users ' +
          '(username_hash, password_hash, ' +
          'username_plaintext, account_creation_time) VALUES (' +
          'UNHEX(MD5(\"' + user + '\")), ' +
          'UNHEX(MD5(\"' + pass + '\")), ' +
          '\"' + user + '\", ' +
          "\'" + new Date().toUTCString() + "\' );";
      const [rows,fields] =  await mySqlPool.query( insert_query );
  
      const details_obj = {
        "username": user,
        "password": pass
      }
      conn.sendUTF( 'server_account_creation_success' );
      logger.log_event( "attempt_create_user()::try", "Successful account creation.", req.socket.remoteAddress, details_obj );
  
    } catch( error ) {
      conn.sendUTF( 'server_account_creation_failure' );
      console.dir( error );
      const details_obj = {
        "username": user,
        "password": pass,
        "error": await error_log.process_text(JSON.stringify(error))
      }
      logger.log_error( "attempt_create_user()::catch", "Failed account creation attempt was made.", 1, req.socket.remoteAddress, details_obj );
    }
  }
  exports.attempt_create_user = attempt_create_user;


/*
This is sent to all users to notify them that a user has disconnected.
*/
function send_LogoutUserNotification( users, inUsername ) {
    const oldUser = {
        type: "chat_event",
        event: "server_remove_user",
        username: inUsername
    };
    const out = JSON.stringify( oldUser );
    users.forEach( user => {
        if( Object.keys(user).length != 0 ) {
            user.connection.send( out );
        }
    });
}
exports.send_LogoutUserNotification = send_LogoutUserNotification;


/*
Used to ensure that each user will have a unqiue name.
Will be replaced with RDBM check.
Currently not in use.
*/
function doesUsernameExist( users, in_username ) {
    users.forEach( user => {
      if( Object.keys(user).length != 0 &&user.username == in_username ) {
        return true;
      }
    });
    return false;
  }
exports.doesUsernameExist = doesUsernameExist;


function send_NewUserNotification( users, in_user_id ) {
    const newUser = {
      type: "chat_event",
      event: "server_new_user",
      username: users[in_user_id].username
    };
    const out = JSON.stringify( newUser );
    users.forEach( user => {
      if( Object.keys(user).length != 0 ) {
        if( user.user_id != in_user_id ) {
          user.connection.send( out );
        }
      }
    });
  }
  
  
  /*
  This is sent to new users, to give them a full list of connected users.
  */
  function send_UserList( users, conn ) {
    const userList = [];
    users.forEach( user=> {
      if( Object.keys(user).length != 0 ) {
        userList.push({
          username: user.username
        });
      }
    });
    const out = {
      type: "chat_event",
      event : "server_user_list",
      user_list : userList
    }
    conn.sendUTF( JSON.stringify( out ) );
  }