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
var https;;
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
}

function load_files() {
  let files = {
    '/' : './content/index.html',
    '/script.js' : './content/script.js',
    '/style.css' : './content/style.css',
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
  app.get( '/', function(req,res) {
    console.log( "get/" );
    console.log( "isMobile: " + req.useragent.isMobile );
    console.log( req.useragent.browser + ' === ' + req.useragent.version  );
    res.send( requests['/'] );
  });
  app.get( '/.well-known/acme-challenge/I0Cc550LmIzJvrykmVidXpCAiiB9X_5OCYVgrvJHH54',
    function(req,res) {
      res.send('I0Cc550LmIzJvrykmVidXpCAiiB9X_5OCYVgrvJHH54.q8CYs8KUtJ2KzQJfOEOVvaCW5_uvHjoFtaDYLhGhWlE');
  });
  app.get( '/style.css', function(req,res) {
    console.log( "style.css" );
    res.contentType('.css');
    res.send( requests['/style.css'] );
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
