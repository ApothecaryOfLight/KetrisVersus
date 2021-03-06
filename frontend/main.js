const subdomain = require('express-subdomain');
const express = require('express');
const useragent = require('express-useragent');
const app = express();
app.use(useragent.express());

const fs = require('fs');

const babelCore = require("@babel/core");
const babelPreset = require("@babel/preset-env");
const babelReact = require("@babel/preset-react");

let requests = {};


/*HTTPS*/
var https;
var privateKey;;
var certificate;
var credentials;
var server;

if( process.argv[2] == "https" ) {
  https = require('https');
  privateKey = fs.readFileSync('/home/ubuntu/KetrisVersus/privkey.pem');
  certificate = fs.readFileSync('/home/ubuntu/KetrisVersus/fullchain.pem');
  credentials = {key: privateKey, cert: certificate};
  server = https.createServer( credentials, app );

  /*HTTP Redirect*/
  const redirect_app = express();
  const redirect_server = require('http').createServer( redirect_app );
  redirect_server.listen( '8081', function() {
    console.log( "Redirect listeneing..." );
  });
  redirect_app.get( '/', function(req,res) {
    console.log( "HTTPS redirect event." );
    res.redirect( 'https://ketris.net' );
  });

  /*Added www Redirect*/
  const router = express.Router();
  router.get( '*', (req,res) => {
    console.log( "Subdomain." );
    res.redirect( 'https://ketris.net' );
  });
  app.use( subdomain( 'www', router ) );
}

function load_files() {
  let files = {
    '/' : './content/index.html',
    '/mobile.html' : './content/mobile.html',
    '/ip_file.js' : './content/ip_file.js',
    '/script.js' : './content/script.js',
    '/style.css' : './content/style.css',
    '/style-mobile.css' : './content/style-mobile.css',
    '/script-ketris.js' : './content/script-ketris.js'
  }
  let images = {
    '/border.png' : './content/border.png',
    '/spritesheet_mod.png' : './content/spritesheet_mod.png',
    '/favicon.ico' : './content/favicon.ico'
  }
  const number_of_files =
    Object.keys(files).length + Object.keys(images).length;
  let file_counter = 0;
  for( const request in files ) {
    fs.readFile( files[request], 'utf8', function read(error, data ) {
      if( error ) {
        throw error;
      }
      if( files[request].slice(-2) == "js" ) {
        babelCore.transform(
          data,
          {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react"
            ],
          },
          function(error,result) {
            if( error ) {
              console.log( error );
            }
            requests[request] = result.code;
            file_counter++;
            if( file_counter >= number_of_files ) {
              doLaunch();
            }
          }
        );
      } else {
        requests[request] = data;
        file_counter++;
        if( file_counter >= number_of_files ) {
          doLaunch();
        }
      }
    });
  }
  for( const request in images ) {
    fs.readFile( images[request], function read( error, data ) {
      if( error ) { throw error; }
      requests[request] = data;
      file_counter++;
      if( file_counter >= number_of_files ) {
        doLaunch();
      }
    });
  }
}
load_files();

function doLaunch() {
  app.get( '/.well-known/acme-challenge/I0Cc550LmIzJvrykmVidXpCAiiB9X_5OCYVgrvJHH54',
    function(req,res) {
      res.send('I0Cc550LmIzJvrykmVidXpCAiiB9X_5OCYVgrvJHH54.q8CYs8KUtJ2KzQJfOEOVvaCW5_uvHjoFtaDYLhGhWlE');
  });
  app.get( '/style.css', function(req,res) {
    console.log( "style.css" );
    res.contentType('.css');
    res.send( requests['/style.css'] );
  });
  app.get( '/style-mobile.css', function(req,res) {
    console.log( "style-mobile.css" );
    res.contentType('.css');
    res.send( requests['/style-mobile.css'] );
  });
  app.get( '/ip_file.js', function(req,res) {
    console.log( "ip_file.js" );
    res.send( requests['/ip_file.js'] );
  });
  app.get( '/script.js', function(req,res) {
    console.log( "script.js" );
    res.send( requests['/script.js'] );
  });
  app.get( '/script-ketris.js', function(req,res) {
    res.send( requests['/script-ketris.js'] );
  });
  app.get( '/border.png', function(req,res) {
    console.log( "Border request!" );
    res.send( requests['/border.png'] );
  });
  app.get( '/spritesheet_mod.png', function(req,res) {
    res.send( requests['/spritesheet_mod.png'] );
  });
  app.get( '/favicon.ico', function(req,res) {
    res.send( requests['/favicon.ico'] );
  });
  app.get( '*', function(req,res) {
    console.log( "get/" );
    console.log( "isMobile: " + req.useragent.isMobile );
    console.log( req.useragent.browser + ' === ' + req.useragent.version  );
    if( req.useragent.isMobile == true ) {
      res.send( requests['/mobile.html'] );
    } else {
      res.send( requests['/'] );
    }
  });

  if( process.argv[2] == "https" ) {
    server.listen( 8080, function() {
      console.log( "HTTPS server listening!" );
    });
  } else {
    app.listen( 8080, function() {
      console.log( "HTTP server listening!" );
    });
  }
}
