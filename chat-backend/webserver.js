/*HTTP/HTTPS Server and Websocket*/
const http = require('http');
const https = require('https');

function do_start_webserver() {
    if( process.argv[2] == "https" ) {
        https = require('https');
        const privateKey = fs.readFileSync('../privkey.pem');
        const certificate = fs.readFileSync('../fullchain.pem');
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
}
exports.do_start_webserver = do_start_webserver;