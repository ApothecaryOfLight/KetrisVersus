const mysql = require('mysql2');

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'ketris_node_user',
  database: 'ketris_db',
  password: 'ketris_node_user_password'
});

/*mysqlConnection.query(
  'select * from test_table;',
  function( error, results, fields ) {
    if( error ) { console.log( error ); }
    console.log( results );
    //console.log( fields );
  }
);*/

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
/*  mysqlConnection.query(
    'SELECT * FROM ketris_users WHERE username_hash=UNHEX(MD5(\"'+inUsername+'\"))',
    function( error, results, fields ) {
      if( error ) { console.log( error ); }
      //console.log( results.length );
      if( results.length == 0 ) {
        console.log( "Username available! Creating user..." );
        mysqlConnection.query(
          'INSERT INTO ketris_users ' +
          '(username_hash,password_hash,username_plaintext,account_creation) VALUES (' +
          'UNHEX(MD5(\"' + inUsername + '\")), ' +
          'UNHEX(MD5(\"' + inPassword + '\")), ' +
          '\"' + inUsername + '\", ' +
          '\'1999-01-01 01:01:01\' );',
          function( error, results, fields ) {
            if( error ) { console.log( error ); }
            console.log( "User created!" );
          }
        );
      } else {
        console.log( "User exists!" );
      }
    }
  )*/
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
  /*mysqlConnection.query(
    'INSERT INTO ketris_users
  );*/
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

//create_user( "bob", "bobspassword" );
//create_user( "sally", "sallyspassword" );
attempt_login( "bob", "bobspassword" );
log_match( "bob", "sally", "1999-01-01 01:01:01", "1999-02-02 01:01:01", 90, 10 );
log_match( "sally", "bob", "1998-01-01 01:01:01", "1998-02-02 01:01:01", 85, 20 );
log_message_to_dev( "Good Employer", "We will hire you!", "2020-12-15 10:00:00" );
