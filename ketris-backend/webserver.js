var http = require('http');


var myPort = 3003;

/*HTTPS*/


/*
This function is used to start the HTTP or HTTPS webserver.

This relies on the process.argv array, which provides access to the command line
arguments supplied in the invokation of the application.

If the https command is supplied, then the security credentials are read from the
filesystem, and used to create a secure HTTPS server.

If the http command is supplied, then the unsecure HTTP server it started. The HTTP
server is for development purposes.
*/
function launch_webserver() {
    if( process.argv[2] == "https" ) {
        const fs = require('fs');
        const https = require('https');
        const privateKey = fs.readFileSync('../privkey.pem');
        const certificate = fs.readFileSync('../fullchain.pem');
        const credentials = {key: privateKey, cert: certificate};
        const server = https.createServer( credentials, function( req, res ) { } );
        server.listen( myPort, function() {
            console.log( "@:" + (new Date()) +
                " Server listening on port " + myPort );
        });
        return server;
    } else if( process.argv[2] == "http" ) {
        const server = http.createServer( (req,res) => {} );
        server.listen( myPort, function() {
            console.log( "@:" + (new Date()) +
                " Server listening on port " + myPort );
        });
        return server;
    }
}

exports.launch_webserver = launch_webserver;