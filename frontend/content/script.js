'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = { liked: false };
	}

	render() {
		if( this.state.liked ) {
			return 'You liked this.';
		}
		return e(
			'button',
			{ onClick: () => this.setState({liked:true}) },
			'Like'
		);
	}
}

function ChatRoom(props) {
	const lines = props.chatLog;
	const retList = lines.map( (line) =>
		<div key={line.uid}>
			{line.user} : {line.text}
		</div>
	);
	return(
		<div>{retList}</div>
	);
}

document.addEventListener( "DOMContentLoaded", function(event) {
	console.log( 'Initing...' );

	let div = document.createElement('div');
	div.className = 'blue';
	div.innerHTML = "<h2>Hello Javascript!!</h2>";
	document.body.append(div);

	console.log( 'Done!' );

	const domContainer = document.querySelector('#like_button_container');
	ReactDOM.render(e(LikeButton), domContainer);

	var ws = new WebSocket( 'ws://34.222.250.86:3000' );
	ws.addEventListener( 'open', function(event) {
		console.log( "WebSocket opened!" );
		//ws.onopen = function() { console.log( "Opened!" ); }
		//ws.onerror = function(error) { console.log( "Error!" ); }
		//ws.send( 'Hellos!' );
	});
	let chatLog = [];
	ws.addEventListener( 'message', function(event) {
		console.log( event.data );
		chatLog.push( {
		  user:'NotYetImplemented',
		  text:event.data,
		  uid: chatLog.length}
		);
		ReactDOM.render(
			<ChatRoom chatLog={chatLog} />,
			document.getElementById('react_container')
		);
	});

	function doSend() {
		const input_textfield = document.getElementById("input_text");
		const input_text = input_textfield.value;
		ws.send( input_text );
	}

	let mySendButton = document.getElementById("send_button");
	mySendButton.addEventListener( 'click', doSend );

	chatLog = [
		{ user: 'me', text: 'hello', uid: 0 },
		{ user: 'you', text: 'hi!', uid: 1 },
		{ user: 'me', text: 'howyadoin?', uid: 2 },
		{ user: 'you', text: 'goodgood, yaself?', uid: 3 },
		{ user: 'me', text: 'goodgood goodgood', uid: 4 }
	];
	ReactDOM.render(
		<ChatRoom chatLog={chatLog} />,
		document.getElementById('react_container')
	);
});
