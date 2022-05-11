/*Express*/
const express = require('express');
const app = express();

/*CORS*/
const cors = require('cors');
app.use(cors());

/*HTTPS*/
var https = require('https');
var privatekey, certificate, credentials;

/*MySQL*/
const mysql = require('mysql2');
const sqlPool = mysql.createPoolPromise({
    connectionLimit: 50,
    host: 'localhost',
    user: 'ketris_node_user',
    password: 'ketris_node_user_password',
    database: 'ketris_db'
});

/*Error logging*/
const error_log = require('./error-logging.js');


/*
This attaches a get route to our Express server, returning the error log in response
to a URI request that ends in /get_error_log.
*/
app.get( '/get_error_log', async function(req,res) {
    console.log( "get_error_log received.");
    try {
        const errors = await error_log.get_error_log();
        res.send({
            error_log: errors
        });
    } catch(error_obj) {
        await error_log.log_error(
            "main.js:app.get:get_error_log",
            "Error in retrieving error log.",
            1,
            "Admin Server",
            error_obj
        );
    }
});


/*
This attaches a get route to our Express server, returning the event log in response
to a URI request that ends in /get_event_log.
*/
app.get( '/get_event_log', async function(req,res) {
    console.log( "get_event_log received.");
    try {
        const events = await error_log.get_event_log();
        res.send({
            event_log: events
        });
    } catch(error_obj) {
        await error_log.log_error(
            "main.js:app.get:get_event_log",
            "Error in retrieving event log.",
            1,
            "Admin Server",
            error_obj
        );
    }
});


app.get( '/get_user_list', async function(req,res) {
    console.log( "get_user_list received." );
    try {
        const get_user_list_query = 
            "SELECT username_plaintext, creation_ip, last_login, account_creation_time " +
            "FROM ketris_users;";
        const [rows,fields] = await sqlPool.query( get_user_list_query );
        res.send({
            user_list: rows
        })
    } catch( error_obj ) {
        await error_log.log_error(
            "main.js:app.get:get_user_list",
            "Error in retrieving user list.",
            1,
            "Admin Server",
            error_obj
        );
    }
})



/*
This acts as our main function. Using process.argv we can check which command line
option was specified at the invokation of this application. If https was provided,
we get the security credentials and launch an HTTPS server.

On the other hand, if http was specified instead, we just launch the Express server
without any security credentials.
*/
if( process.argv[2] == "https" ) {
    console.log( "Launching production server..." );
    const file_stream = require('fs');
    privateKey = file_stream.readFileSync('../privkey.pem');
    certificate = file_stream.readFileSync('../fullchain.pem');
    credentials = {key: privateKey, cert: certificate};
    server = https.createServer( credentials, app );
    server.listen( 53004 );
  } else if( process.argv[2] == "http" ) {
    console.log( "Launching dev server..." );
    app.listen( 53004 );
  }