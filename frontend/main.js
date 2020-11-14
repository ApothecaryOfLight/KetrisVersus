const express = require('express');
const useragent = require('express-useragent');
const app = express();
app.use(useragent.express());

const fs = require('fs');

const babelCore = require("@babel/core");
const babelPreset = require("@babel/preset-env");

let requests = {};

function load_files() {
	let files = {
		'/' : './content/index.html',
		'/script.js' : './content/script.js',
		'/style.css' : './content/style.css',
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
		console.log( "get/" );
		console.log( req.useragent.browser + ' === ' + req.useragent.version  );
		res.send( requests['/'] );
	});
	app.get( '/style.css', function(req,res) {
		console.log( "style.css" );
		res.contentType('.css');
		res.send( requests['/style.css'] );
	});
	app.get( '/script.js', function(req,res) {
		console.log( "script.js" );
//		res.send( requests['/script.js'] );
		babelCore.transform(
			requests['/script.js'],
			{
				presets: [
					"@babel/preset-env",
					"@babel/preset-react"
				]
			},
			function(error,result) {
				if( error ) {
					console.log( error );
				}
				res.send( result.code );
			}
		);
	});
	app.listen(8080, function() {
		console.log( 'HTTP Server listening!' );
	});
}