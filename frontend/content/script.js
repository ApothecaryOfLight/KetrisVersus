'use strict';

const e = React.createElement;

//TODO: List of IDs, retire, reissue
class UID {
	constructor() {
		this.fields = {};
	}
	generateUID( inField ) {
		if( inField in this.fields ) {
			this.fields[inField]++;
			return this.fields[inField]
		} else {
			this.fields[inField] = 0;
			//this.fields[inField].counter = 0;
			return 0;
		}
	}
	retireUID( inField, inUID ) {

	}
}

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

/*function UserList() {
	const
}*/

class CurrentUsers extends React.Component {
	/*constructor(props) {
		super(props)
		this.state = {
			"users" : []
		};
	}*/
	//const loggedUsers = React.useState( this.props.users );
  render() {
    const users = this.props.users;
    const users_dom = users.map( (user) =>
      <div className='user_wrapper_class' key={user.UID}>
        <div className='user_class' key={user.UID}>
          {user.username}
        </div>
      </div>
    );
    return(
      <div>{users_dom}</div>
    );
  }
}

class AvailGames extends React.Component {
  render() {
    const avail_games = this.props.avail_games;
    const avail_games_dom = avail_games.map( (avail_game) =>
      <div className='avail_game_wrapper_class'>
        <div className='avail_game_class' key={avail_game.UID}>
          {avail_game.game_name}
        </div>
      </div>
    );
    return(
      <div>{avail_games_dom}</div>
    );
  }
}

function launchLoginInterface( inWebsocket ) {

}

function launchChatInterface( ws ) {
	console.log( "Loggin in..." );
	let login_interface = document.getElementById('login_interface');
	let chat_interface = document.getElementById('chat_interface');
	login_interface.style.display = "none";
	chat_interface.style.display = "flex";

	let chatLog = [];
	let userList = [];
	let gameList = [];
	const myUID = new UID();
	//ws.removeEventListener( 'message' );

	ws.addEventListener( 'message', function(event) {
		const inMessage = JSON.parse( event.data );

		if( inMessage.event === "chat_message" ) {
			chatLog.push( {
			  user: inMessage.username,
			  text: inMessage.text,
			  uid: chatLog.length}
			);
			ReactDOM.render(
				<ChatRoom chatLog={chatLog} />,
				document.getElementById('chat_box')
			);
			let myChatbox = document.getElementById('chat_box');
			console.dir( myChatbox );
			myChatbox.scrollTop =  myChatbox.scrollHeight;
		} else if( inMessage.event === "new_user" ) {
			console.log( "New User" );
			userList.push({
				username: inMessage.username,
				UID: myUID.generateUID( "user" )
			});
			ReactDOM.render(
				<CurrentUsers users={userList} />,
				document.getElementById('user_area')
			);
		} else if( inMessage.event === "remove_user" ) {
			console.log( "Remove User" );
			userList.splice( userList.indexOf( inMessage.username ), 1 );
			ReactDOM.render(
				<CurrentUsers users={userList} />,
				document.getElementById('user_area')
			);
		} else if( inMessage.event === "new_game" ) {
			gameList.push({
				game_name : inMessage.game_name,
				UID : myUID.generateUID( "game" )
			});
			ReactDOM.render(
				<AvailGames avail_games={gameList} />,
				document.getElementById('avail_games_area')
			);
		} else if( inMessage.event === "remove_game" ) {
			gameList.splice( gameList.indexOf( inMessage.game_name ), 1 );
			ReactDOM.render(
				<AvailGames avail_games={gameList} />,
				document.getElementById('avail_games_area')
			);
		} else {
			console.log( "Unrecognized message." );
			console.dir( inMessage );
		}
	});

	function send_chat_message( inMessage ) {
		const send_message = {
			event : "chat_message",
			text : inMessage
		}
		const send_message_json = JSON.stringify( send_message );
		ws.send( send_message_json );
	}

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
				send_chat_message( textfield );
			}
			myInputText.value = "";
		}
	});

	let myNewGameButton = document.getElementById("start_new_game_button");
	myNewGameButton.addEventListener( 'click', () => {
		ws.send( JSON.stringify({
			event: "new_game"
		}));
	});

	function doSend() {
		//const input_textfield = document.getElementById("input_text");
		const input_text = myInputText.value;
		if( input_text != "" ) {
			send_chat_message( input_text );
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
}

function doLogin( websocket, username, password ) {
	const login = {
		"event" : "login",
		"username" : username,
		"password" : password
	}
	const login_text = JSON.stringify( login );
	websocket.send( login_text );
}

document.addEventListener( "DOMContentLoaded", function(event) {
	console.log( 'Initing...' );

	let login_interface = document.getElementById('login_interface');
	let chat_interface = document.getElementById('chat_interface');
	chat_interface.style.display = "none";

	var ws = new WebSocket( 'ws://34.222.250.86:3000' );
	ws.addEventListener( 'open', function(event) {
		console.log( "WebSocket opened!" );
		//ws.onopen = function() { console.log( "Opened!" ); }
		//ws.onerror = function(error) { console.log( "Error!" ); }
		//ws.send( 'Hellos!' );
	});

	let login_button = document.getElementById('login_button');
	login_button.addEventListener( 'click', function() {
		let username_box = document.getElementById('login_username');
		let password_box = document.getElementById('login_password');
		let username = username_box.value;
		let password = password_box.value;
		if( username != "" && password != "" ) {
			console.log( "Attempting login!" );
			doLogin( ws, username, password );
		}
	});

	ws.addEventListener( 'message', function(event) {
		console.log( "Message!" );
		if( event.data === "login_approved" ) {
			console.log( "Login approved!" );
			launchChatInterface( ws );
		}
	});
});
