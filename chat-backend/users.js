/*
This function is called after the user's credentials have been validated.
This adds the user to the chat server's listing of users,
calls functions to send this new user listings of other logged in users
and posted games, and then calls a function to send a notification to all
other logged in users that this new user has also logged in.

myLogger: Reference for logging events and errors.

new_user: Object reference to the newly created user's information.

username: The user's username, as a hashed value.

password: The user's password, as a hashed value.

users: Array containing a list of all connected users.

games: Array containing a list of all posted games.

myWebsocketConnection: A Websocket connection for this user.

myUIDGen: A reference to the unique identifier generator.

send_GameList: A Function reference that will be used to send the list of posted
games if the login is successful.
*/
async function do_approve_login( myLogger, new_user, username, password, users, games, myWebsocketConnection, myUIDGen, send_GameList ) {
    try {
      //Assign the new_user Object the relevant values.
      new_user.username = username;
      new_user.password = password;
      new_user.user_id = myUIDGen.generate_uid( "users" );
      new_user.has_game = false;
      new_user.game_id = -1;

      //Place the new user into the users array.
      users[new_user.user_id] = new_user;

      //Send a message to the client informing them that their login was a success.
      myWebsocketConnection.myConnection.sendUTF( "server_login_approved" );

      //Send the client lists of connected users and available games.
      send_UserList( users, myWebsocketConnection.myConnection );
      send_GameList( myLogger, games, myWebsocketConnection );

      //Send a new user login event to all other connected users.
      send_NewUserNotification( users, new_user.user_id );
    } catch( error_obj ) {
      //If there was an error, log it.
      myLogger.log_error(
          "users.js::do_approve_login()::catch",
          "Error while approving login.",
          1,
          myWebsocketConnection.ip,
          error_obj
      );
    }
}
exports.do_approve_login = do_approve_login;


/*
Sends a message to the user that they failed to provide valid credentials.

myLogger: Reference for logging events and errors.

myWebsocketConnection: Websocket connection to client.
*/
async function do_reject_login( myLogger, myWebsocketConnection ) {
    try {
      //Send the user a message informing them that their login attempt failed.
      myWebsocketConnection.myConnection.sendUTF( "server_login_failed" );
    } catch( error_obj ) {
      //If there was an error, log it.
      myLogger.log_error(
        "users.js::do_reject_login()",
        "Error while rejecting login.",
        1,
        myWebsocketConnection.ip,
        error_obj
      );
    }
}
exports.do_reject_login = do_reject_login;


/*
Sends a message to the user that they failed to provide valid credentials.

myLogger: Reference for logging events and errors.

myWebsocketConnection: Websocket connection to client.
*/
async function do_reject_account_creation( myLogger, myWebsocketConnection ) {
    try {
      //Send rejection message to client.
      myWebsocketConnection.myConnection.sendUTF( "server_account_creation_failure" );
    } catch( error_obj ) {
      //If there was an error, log it.
      myLogger.log_error(
          "users.js::do_reject_account_creation()",
          "Error while rejecting account creation.",
          1,
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

mySQLPool: Object reference that provides MySQL querying functionality.

new_user: Object reference to the newly created user's information.

inUsername: The user's username, as a hashed value.

inPassword: The user's password, as a hashed value.

users: Array containing a list of all connected users.

games: Array containing a list of all posted games.

myWebsocketConnection: A Websocket connection for this user.

myUIDGen: A reference to the unique identifier generator.

send_GameList: A Function reference that will be used to send the list of posted
games if the login is successful.
*/
async function attempt_login ( logger, mySqlPool, new_user, inUsername, inPassword, users, games, myWebsocketConnection, myUIDGen, send_GameList ) {
  try {
    //Ensure that no one is already logged in with those credentials by testing
    //every logged in user's username against the new username.
    if( !users.every( (user) => { return user.username != inUsername; } ) ) {
      //Reject login.
      do_reject_login( logger, myWebsocketConnection );

      //Log the event.
      const details_obj = {
          username: inUsername,
          password: inPassword,
          reason: "User already logged in."
      }
      logger.log_event(
        "attempt_login()::try",
        "Failed login attempt was made.",
        myWebsocketConnection.ip,
        details_obj
      );

      //End the function.
      return;
    }

    //Construct the MySQL query to login.
    const [rows,fields] = await mySqlPool.query(
    'SELECT * FROM ketris_users ' +
    'WHERE password_hash=UNHEX(MD5(\"' + inPassword + '\")) AND ' +
    'username_hash=UNHEX(MD5(\"'+inUsername+'\"));' );
    if( rows.length > 0 ) {
      //Send login approval to the petitioning client.
      do_approve_login(
        logger,
        new_user, inUsername, inPassword,
        users, games,
        myWebsocketConnection,
        myUIDGen, send_GameList
      );

      //Log the successful login.
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
      //Reject the failed login.
      do_reject_login( logger, myWebsocketConnection );

      //Log the event.
      const details_obj = {
          username: inUsername,
          password: inPassword,
          reason: "Credentials not matched in database."
      }
      logger.log_event(
        "attempt_login()::try",
        "Failed login attempt was made. Credentials not matched in database.",
        myWebsocketConnection.ip,
        details_obj
      );
    }
  } catch( error_obj ) {
    //This is triggered if an error was thrown during the login attempt.
    //Reject the failed login.
    do_reject_login( logger, myWebsocketConnection );

    //Log the error.
    const details_obj = {
        username: inUsername,
        password: inPassword,
        error: error_obj
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

new_user: Object reference to the newly created user's information.

inUsername: The user's username, as a hashed value.

inPassword: The user's password, as a hashed value.

users: Array containing a list of all connected users.

games: Array containing a list of all posted games.

myWebsocketConnection: A Websocket connection for this user.

myUIDGen: A reference to the unique identifier generator.

send_GameList: A Function reference that will be used to send the list of posted
games if the login is successful.
*/
async function attempt_create_user( logger, mySqlPool, new_user, inUsername, inPassword, users, games, myWebsocketConnection, myUIDGen, send_GameList ) {
  try {
    //Stringbash the insertion query.
    const insert_query = 'INSERT INTO ketris_users ' +
      '(username_hash, password_hash, ' +
      'username_plaintext, account_creation_time, creation_ip ) VALUES (' +
      'UNHEX(MD5(\"' + inUsername + '\")), ' +
      'UNHEX(MD5(\"' + inPassword + '\")), ' +
      '\"' + inUsername + '\", ' +
      '\"' + new Date().toUTCString() + '\", ' +
      '\"' + myWebsocketConnection.ip + '\");';

    //Make the query, attempting to insert the new credentials into the database.
    const [rows,fields] =  await mySqlPool.query( insert_query );

    //If there are affected rows, that means insertion was a success.
    if( rows.affectedRows > 0 ) {
      //Send a login approval to the petitioning client.
      do_approve_login(
        logger,
        new_user, inUsername, inPassword,
        users, games,
        myWebsocketConnection, myUIDGen, send_GameList
      );

      //Log the event.
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
    } else {
      //Reject the failed account creation attempt, as insertion of the new
      //credentials failed.
      do_reject_account_creation( logger, myWebsocketConnection );

      //Log the event.
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
    //An error took place, so reject the attempted account creation.
    do_reject_account_creation( logger, myWebsocketConnection );

    //Log the error.
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

users: Array containing connected users.

inUsername: The username of the client who has logged out.
*/
function send_LogoutUserNotification( users, inUsername ) {
  //Create an object to be used as the message that will notify connected users that
  //the user in question has logged out.
  const oldUser = {
      type: "chat_event",
      event: "server_remove_user",
      username: inUsername
  };

  //Stringify that Object message.
  const out = JSON.stringify( oldUser );

  //Send that Object message to every connected user.
  users.forEach( user => {
    if( Object.keys(user).length != 0 ) {
      user.connection.send( out );
    }
  });
}
exports.send_LogoutUserNotification = send_LogoutUserNotification;


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
exports.send_UserList = send_UserList;