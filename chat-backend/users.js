/*
This function is called after the user's credentials have been validated.
This adds the user to the chat server's listing of users,
calls functions to send this new user listings of other logged in users
and posted games, and then calls a function to send a notification to all
other logged in users that this new user has also logged in.
*/
async function do_approve_login( myLogger, new_user, username, password, users, games, myWebsocketConnection, myUIDGen, send_GameList ) {
    try {
        new_user.username = username;
        new_user.password = password;
        new_user.user_id = myUIDGen.generate_uid( "users" );
        new_user.has_game = false;
        new_user.game_id = -1;
        users[new_user.user_id] = new_user;
        myWebsocketConnection.myConnection.sendUTF( "server_login_approved" );
        send_UserList( users, myWebsocketConnection.myConnection );
        send_GameList( myLogger, games, myWebsocketConnection );
        send_NewUserNotification( users, new_user.user_id );
    } catch( error_obj ) {
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


/*
Sends a message to the user that they failed to provide valid credentials.
*/
async function do_reject_account_creation( logger, myWebsocketConnection ) {
    try {
      myWebsocketConnection.myConnection.sendUTF( "server_account_creation_failure" );
    } catch( error_obj ) {
        myLogger.log_error(
            "users.js::do_reject_account_creation()",
            "Error while rejecting account creation.",
            myWebsocketConnection.ip,
            error_obj
        );
    }
}
exports.do_reject_account_creation = do_reject_account_creation;
  

/*
This function attempts to login with the provided credentials. If the user has not
created an account with those credentials, or supplied incorrect credentials, then
the login attempt will fail.

If the login attempt succeeds, an approval message is sent to the client, moving
that client past the login interface and into the chatroom interface.

If the login attempt fails, a rejection message is send to the client, resulting
in a modal popup appearing informing the user that their login attempt failed.

logger: Object that provides rror/event logging functionality.

new_user: Object reference to the newly created user's information.

inMessage: Object reference containing the login-attempt's provided information.

users: Array containing a list of all connected users.

games: Array containing a list of all posted games.

mySQLPool: Object reference that provides MySQL querying functionality.

inUsername: The user's username, as a hashed value.

inPassword: The user's password, as a hashed value.

myWebsocketConnection: A Websocket connection for this user.

myUIDGen: A reference to the unique identifier generator.

send_GameList: A Function reference that will be used to send the list of posted
games if the login is successful.
*/
async function attempt_login ( logger, mySqlPool, new_user, inUsername, inPassword, users, games, myWebsocketConnection, myUIDGen, send_GameList ) {
    try {
        const [rows,fields] = await mySqlPool.query(
        'SELECT * FROM ketris_users ' +
        'WHERE password_hash=UNHEX(MD5(\"' + inPassword + '\")) AND ' +
        'username_hash=UNHEX(MD5(\"'+inUsername+'\"));' );
        if( rows.length > 0 ) {
            do_approve_login( logger, new_user, inUsername, inPassword, users, games, myWebsocketConnection, myUIDGen, send_GameList );
            const details_obj = {
                "username": inUsername,
                "password": inPassword
            }
            logger.log_event(
              "attempt_login()::try",
              "Successful login.",
              myWebsocketConnection.ip,
              details_obj
            );
        } else {
            do_reject_login( logger, myWebsocketConnection );
            const details_obj = {
                "username": inUsername,
                "password": inPassword
            }
            logger.log_event(
              "attempt_login()::try",
              "Failed login attempt was made.",
              myWebsocketConnection.ip,
              details_obj
            );
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
  

/*
This function attempts to create a set of credentials. If the credential creation
attempt fails, a message is sent to the user informing them that the credential
creation attempt failed.

logger: Object reference providing error/event logging functionality.

mySqlPool: Object reference providing MySQL query funcionality.


*/
async function attempt_create_user( logger, mySqlPool, new_user, inUsername, inPassword, users, games, myWebsocketConnection, myUIDGen, send_GameList ) {
  try {
    const insert_query = 'INSERT INTO ketris_users ' +
      '(username_hash, password_hash, ' +
      'username_plaintext, account_creation_time) VALUES (' +
      'UNHEX(MD5(\"' + inUsername + '\")), ' +
      'UNHEX(MD5(\"' + inPassword + '\")), ' +
      '\"' + inUsername + '\", ' +
      "\'" + new Date().toUTCString() + "\' );";

    const [rows,fields] =  await mySqlPool.query( insert_query );

    if( rows.affectedRows > 0 ) {
      const details_obj = {
        username: inUsername,
        password: inPassword
      }
      logger.log_event(
        "attempt_create_user()::try",
        "Successful account creation.",
        myWebsocketConnection.ip,
        details_obj
      );
      do_approve_login( logger, new_user, inUsername, inPassword, users, games, myWebsocketConnection, myUIDGen, send_GameList );
    } else {
      do_reject_account_creation( logger, myWebsocketConnection );
      const details_obj = {
          username: inUsername,
          password: inPassword
      }

      logger.log_event(
        "attempt_create_user()::try",
        "Failed account creation attempt was made.",
        myWebsocketConnection.ip,
        details_obj
      );
    }
  } catch( error ) {
    do_reject_account_creation( logger, myWebsocketConnection );
    const details_obj = {
      username: inUsername,
      password: inPassword,
      error: error
    }
    logger.log_error(
      "attempt_create_user()::catch",
      "Error while attempting to create account.",
      1,
      myWebsocketConnection.ip,
      details_obj
    );
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


/*
This function sends a message to each connected user that a new user has successfully
logged in.

users: Array reference containing all connected users.

in_user_id: Unique identifier of the new user who just successfully logged in.
*/
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