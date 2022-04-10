var http = require('http');


var myPort = 3003;

/*HTTPS*/

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