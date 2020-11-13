document.addEventListener( "DOMContentLoaded", function(event) {
	console.log( 'Initing...' );

	let div = document.createElement('div');
	div.className = 'blue';
	div.innerHTML = "<h2>Hello Javascript!!</h2>";
	document.body.append(div);

	console.log( 'Done!' );
});
