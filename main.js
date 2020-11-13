const express = require('express');
const useragent = require('express-useragent');
const app = express();
app.use( useragent.express() );

const fs = require('fs');

let requests = {};

function load_files() {
	let files = {
		'/' : './frontend/index.html',
		'/script.js' : './frontend/script.js',
		'/style.css' : './frontend/style.css'
	}
	let file_counter = 0;
	for( const request in files ) {
		fs.readFile( files[request], 'utf8', function read(error, data ) {
			if( error ) {
				throw error;
			}
			requests[request] = data;
			file_counter++;
			isLoaded( file_counter );
		});
	}
}
load_files();

function isLoaded( inCount ) {
	if( inCount >= 3 ) {
		doLaunch();
	}
}

function doLaunch() {
	app.get( '/', function(req,res) {
		console.log( req.useragent.browser + ' === ' + req.useragent.version  );
		res.send( requests['/'] );
	});
	app.get( '/style.css', function(req,res) {
		res.contentType('.css');
		res.send( requests['/style.css'] );
	});
	app.get( '/script.js', function(req,res) {
		res.send( requests['/script.js'] );
	});
	app.listen(80, function() {
		console.log( 'HTTP Server listening.' );
	});
}
