const express = require('express');
const app = express();
const fs = require('fs');

/*let raw_style, raw_script, raw_index;

fs.readFile('./frontend/index.html', 'utf8', function read(error,data) {
	if( error ) {
		throw error;
	}
	raw_index = data;
	console.log( raw_index );
	console.log( "Loaded index.html" );
});*/

let requests = {};

function load_files() {
	let files = {
		'/' : './frontend/index.html',
		'/script.js' : './frontend/script.js',
		'/style.css' : './frontend/style.css'
	}
	//console.dir( files )
	let file_counter = 0;
	for( const request in files ) {
		//console.log( 'Loading request: ' + request + ' at ' + files[request] );
		fs.readFile( files[request], 'utf8', function read(error, data ) {
			if( error ) {
				throw error;
			}
			//console.log( data )
			requests[request] = data;
			//console.log( "Loaded!" );
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
		res.send( requests['/'] );
	});
	app.get( '/style.css', function(req,res) {
//		res.setHeader('Content-Type','text/css');
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
