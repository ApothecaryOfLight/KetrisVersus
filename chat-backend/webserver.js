/*HTTP/HTTPS Server and Websocket*/
const http = require('http');
const https = require('https');

/*File system*/
const filesystem = require('fs');


/*
This function is used to start the HTTP or HTTPS webserver.

This relies on the process.argv array, which provides access to the command line
arguments supplied in the invokation of the application.

If the https command is supplied, then the security credentials are read from the
filesystem, and used to create a secure HTTPS server.

If the http command is supplied, then the unsecure HTTP server it started. The HTTP
server is for development purposes.

myLogger: Object reference providing error/event logging functionality.
*/
function do_start_webserver( myLogger ) {
    try {
        if( process.argv[2] == "https" ) {
            const privateKey = filesystem.readFileSync('../privkey.pem');
            const certificate = filesystem.readFileSync('../fullchain.pem');
            const credentials = {key: privateKey, cert: certificate};
            return https.createServer(
                credentials,
                (request, response) => {
                    response.writeHead(404);
                    response.end();
                }
            );
        } else if( process.argv[2] == "http" ) {
            return http.createServer( function(request,response) {
                response.writeHead( 404 );
                response.end();
            });
        } else {
            console.log( "Incorrect command line invokation. Specify http or https.");
            process.exit();
        }
        console.log("done");
    } catch( error_obj ) {
        myLogger.log_error(
            "webserver.js::do_start_webserver()::catch",
            "Error starting webserver.",
            1,
            "server",
            error_obj
        );
    }
}
exports.do_start_webserver = do_start_webserver;