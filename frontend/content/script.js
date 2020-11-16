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
	retireAll( inField ) {

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
  console.log( "Rendering" );
  console.dir( this.props.users );
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
      <div className='avail_game_wrapper_class' key={avail_game.UID}>
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


/*If, for asynchronous reasons or other error, our user tries
to interact with a user or game that no longer exists,
our server will refuse the request and send full lists of relevant data.
We could, as the commented out code depicts, iterate through
both old and new lists, inserting and deleting as appropriate.
However that would be a relatively expensive operation,
even with the increased efficiency of DOM manipulation gained
through react and the uniquely identifying keys.*/
function updateUserList( UserList, UpdatedUserList, myUID ) {
  console.log( "Update UserList!" );
  /*UpdatedUserList.forEach( (updated_user) => {
    const user_index = UserList.indexOf( updated_user.username );
    if( user_index == -1 ) { //There is a new user who was missed.
      UserList.push({
        username: updated_user.username,
        UID: myUID.generate( "user" );
      });
    }
  );
  UserList.forEach( (existing_user,index) => {
    const updated_user_index = UpdatedUserList.indexOf( existing_user.username );
    if( updated_user.index == -1 ) { //A user left and was missed.
      UserList.splice( index, 1 );
    }
  });*/
  console.log( "OldList: " );
  console.dir( UserList );
  console.log( "NewList: " );
  console.dir( UpdatedUserList );
  //UserList = [];
  myUID.retireAll( "user" );
  UpdatedUserList.forEach( (user) => {
    UserList.push({
      username: user.username,
      UID: myUID.generateUID( "user" )
    });
  });
console.dir( UserList );
  ReactDOM.render(
    <CurrentUsers users={UserList} />,
    document.getElementById('user_area')
  );
}

function updateGameList( AvailGamesList, UpdatedGameList, myUID ) {
  AvailGamesList = [];
  myUID.retireAll( "game" );
  UpdatedGameList.forEach( (game) => {
    AvailGamesList.push({
      game_name : game.game_name,
      UID: myUID.generateUID( "game" )
    });
  });
  ReactDOM.render(
    <AvailGames avail_games={AvailGamesList} />,
    document.getElementById('avail_games_area')
  );
}

//Chrome's dev console logs collections (console.dir) by reference.
//This function ensures that you will see a snapshot of the data
//At the time the log takes place.
//Recursivity could be easily implemented.
function doLogObject( inObj ) {
  inObj.forEach( (element) => {
    console.log( element );
  });
}

function launchChatInterface( ws ) {
	console.log( "Launching chat interface!" );
	let login_interface = document.getElementById('login_interface');
	let chat_interface = document.getElementById('chat_interface');
	login_interface.style.display = "none";
	chat_interface.style.display = "flex";

	let chatLog = [];
	const userList = [];
	let gameList = [];
	const myUID = new UID();
	//ws.removeEventListener( 'message' );

	ws.addEventListener( 'message', function(event) {
		const inMessage = JSON.parse( event.data );
		console.log( "==========================================" );
		console.dir( userList );
		if( inMessage.event === "chat_message" ) {
			console.log( "chat_message" );
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
			console.dir( inMessage.username );
			userList.push({
				username: inMessage.username,
				UID: myUID.generateUID( "user" )
			});
			console.dir( userList );
			ReactDOM.render(
				<CurrentUsers users={userList} />,
				document.getElementById('user_area')
			);
		} else if( inMessage.event === "remove_user" ) {
			console.log( "Remove User: " + inMessage.username );
			userList.forEach( (user,index) => {
				if( user.username == inMessage.username ) {
					userList.splice(index,1);
				}
			});
			ReactDOM.render(
				<CurrentUsers users={userList} />,
				document.getElementById('user_area')
			);
		} else if( inMessage.event === "new_game" ) {
			console.log( "new_game" );
			gameList.push({
				game_name : inMessage.game_name,
				UID : myUID.generateUID( "game" )
			});
			ReactDOM.render(
				<AvailGames avail_games={gameList} />,
				document.getElementById('avail_games_area')
			);
		} else if( inMessage.event === "remove_game" ) {
			console.log( "remove_game" );
			gameList.forEach( (game,index) => {
				if( game.game_name == inMessage.game_name ) {
					gameList.splice( index, 1 );
				}
			});
			ReactDOM.render(
				<AvailGames avail_games={gameList} />,
				document.getElementById('avail_games_area')
			);
		} else if( inMessage.event === "user_list" ) {
			console.log( "Userlist!" );
			//Should only happen on initial login.
			//Or if the user tries to interact w/ logged out user.
			console.log( "OldListPre" );
			console.dir( userList );
			updateUserList( userList, inMessage.user_list, myUID );
		} else if( inMessage.event === "game_list" ) {
			console.log( "game_list" );
			//Should only happen if user tries to join removed game.
			updateGameList( userList, inMessage.game_list, myUID );
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
		if( event.data === "login_approved" ) {
			console.log( "Login approved!" );
			launchChatInterface( ws );
		}
	});
});
