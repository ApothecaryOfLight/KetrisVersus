const mysql = require('mysql2');
const wsServer = require('websocket').server;
const http = require('http');

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'ketris_node_user',
  database: 'ketris_db',
  password: 'ketris_node_user_password'
});

function attempt_login ( inUsername, inPassword ) {
  mysqlConnection.query(
    'SELECT * FROM ketris_users ' +
    'WHERE password_hash=UNHEX(MD5(\"' + inPassword + '\")) AND ' +
    'username_hash=UNHEX(MD5(\"'+inUsername+'\"));',
    function( error, results, fields ) {
      if( error ) { console.log( error ); }
      if( results.length > 0 ) {
        console.log( "Login of " + inUsername + " approved!" );
      }
    }
  );
}

function does_username_exist( inUsername ) {
  mysqlConnection.query(
    'SELECT * FROM ketris_users ' +
    'WHERE username_hash=UNHEX(MD5(\"' + inUsername + '\"));',
    function( error, results, fields ) {
      if( error ) { console.log( error ); }
      if( results.length > 0 ) {
        return false;
      } else {
        return true;
      }
    }
  );
}

function create_user ( inUsername, inPassword ) {
  if( does_username_exist( inUsername ) == false ) {
    console.log( "Username available! Creating user..." );
    mysqlConnection.query(
      'INSERT INTO ketris_users ' +
      '(username_hash,password_hash,username_plaintext,account_creation) VALUES (' +
      'UNHEX(MD5(\"' + inUsername + '\")), ' +
      'UNHEX(MD5(\"' + inPassworrd + '\")), ' +
      '\"' + inUsername + '\", ' +
      '\'1999-01-01 01:01:01\' );',
      function( error, results, fields ) {
        if( error ) { console.log( error ); }
        console.log( "User created!" );
      }
    );
  }
}

function log_match( inPostingUser, inAcceptingUser, inStartTime, inEndTime,
  posting_user_score, accepting_user_score ) {
  mysqlConnection.query(
    'INSERT INTO ketris_matches ' +
    '( posting_user, accepting_user, ' +
    'timestamp_start, timestamp_end, ' +
    'posting_user_score, accepting_user_score ) VALUES ' +
    '( \"' + inPostingUser + '\", \"' + inAcceptingUser + '\", ' +
    '\"' + inStartTime + '\", \"' + inEndTime + '\", ' +
    '\"' + posting_user_score + '\", \"' + accepting_user_score + '\");',
    function( error, results, fields ) {
      if( error ) { console.log( error ); }
      console.log( "Match logged!" );
    }
  );
}

function log_message_to_dev( inAuthor, inBodyText, inPostingTime ) {
  mysqlConnection.query(
    'INSERT INTO ketris_messages ' +
    '( author_name, message_body, timestamp ) VALUES ' +
    '(\"' + inAuthor + '\", \"' + inBodyText + '\", \"' + inPostingTime + '\");',
    function( error, results, fields ) {
      if( error ) { console.log( error ); }
      console.log( "Dev message logged!" );
    }
  );
}

function retrieve_dev_messages() {
  mysqlConnection.query(
    'SELECT * FROM ketris_messages;',
    function( error, results, fields ) {
      if( error ) { console.log( error ); return error; }
      return result;
    }
  );
}

//create_user( "bob", "bobspassword" );
//create_user( "sally", "sallyspassword" );
//attempt_login( "bob", "bobspassword" );
//log_match( "bob", "sally", "1999-01-01 01:01:01", "1999-02-02 01:01:01", 90, 10 );
//log_match( "sally", "bob", "1998-01-01 01:01:01", "1998-02-02 01:01:01", 85, 20 );
//log_message_to_dev( "Good Employer", "We will hire you!", "2020-12-15 10:00:00" );

const myServer = http.createServer( function( request, response ) {} );
myServer.listen( 8989, function() {
  console.log( "Now listening on 8989" );
});
const myWSServer = new wsServer({
  httpServer: server
});

myWSServer.on('request', function( request ) {
  console.log( "Connection!" );
  var ketris_backend = request.accept( null, request.origin );
  ketris_backend.on( 'message', function( message ) {
    const inMessage = JSON.parse( message.utf8Data );
    console.log( "Recieved message." );
    console.dir( inMessage );
    ketris_backend.send( 'yepuruni' );
  });
});
