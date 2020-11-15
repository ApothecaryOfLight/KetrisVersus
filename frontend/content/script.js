'use strict';

const e = React.createElement;

function ChatRoom(props) {
	const lines = props.chatLog;
	const retList = lines.map( (line) =>
		<div className='chat_line_wrapper_class' key={line.uid}>
		<div className='chat_line_class' key={line.uid}>
			{line.user} : {line.text}
		</div>
		</div>
	);
	return(
		<div>{retList}</div>
	);
}

function launchLoginInterface( inWebsocket ) {

}

function launchChat( inWebsocket ) {

}

document.addEventListener( "DOMContentLoaded", function(event) {
	console.log( 'Initing...' );

/*	let login_interface = document.getElementById('login_interface');
	let chat_interface = document.getElementById('chat_interface');
	chat_interface.display = "none";*/

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
			document.getElementById('chat_box')
		);
		let myChatbox = document.getElementById('chat_box');
		console.dir( myChatbox );
		myChatbox.scrollTop =  myChatbox.scrollHeight;
	});


	let mySendButton = document.getElementById("send_button");
	mySendButton.addEventListener( 'click', doSend );

	let myInputText = document.getElementById("input_text");
	myInputText.addEventListener( 'keydown', keypress_event => {
		//console.dir( keypress_event.key );
		if( keypress_event.key === "Enter" ) {
			keypress_event.preventDefault();
			console.log( "enter!" );
			const textfield = myInputText.value;
			if( textfield != "" ) {
				ws.send( textfield );
			}
			myInputText.value = "";
		}
	});

	function doSend() {
		//const input_textfield = document.getElementById("input_text");
		const input_text = myInputText.value;
		if( input_text != "" ) {
			ws.send( input_text );
		}
		myInputText.value = "";
		myInputText.focus()
	}


	chatLog = [
		{ user: 'me', text: 'hello', uid: 0 },
		{ user: 'you', text: 'hi!', uid: 1 },
		{ user: 'me', text: 'howyadoin?', uid: 2 },
		{ user: 'you', text: 'goodgood, yaself?', uid: 3 },
		{ user: 'me', text: 'goodgood goodgood', uid: 4 }
	];
	ReactDOM.render(
		<ChatRoom chatLog={chatLog} />,
		document.getElementById('chat_box')
	);
});
