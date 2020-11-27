'use strict';

const e = React.createElement;

class UID {
	constructor() {
		this.UIDs = [];
	}
	generateUID( inField ) {
		if( !this.UIDs[inField] ) {
			this.UIDs[inField] = {
				counter: 1,
				retiredIDs : []
			};
			return 0;
		} else if( this.UIDs[inField].reitredIDs.length ) {
			return this.UIDs[inField].retiredIDs.pop();
		} else {
			return this.UIDs[inField].counter++;
		}
	}
	retireUID( inField, inUID ) {
		this.UIDs[inField].retiredIDs.push( inUID );
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
		<div id='chat_box' className='chat_box_class'>{retList}</div>
	);
}

class CurrentUsers extends React.Component {
  constructor( userlist, websocket ) {
    super( userlist, websocket );
    this.state = {...userlist};
    this.UID = new UID;
  }
  componentDidMount() {
    this.setState( this.state.userlist );
    let parent = this;
    this.state.websocket.addEventListener('message', function(event) {
      const inMessage = JSON.parse( event.data );
      if( inMessage.event === "new_user" ) {
        parent.state.userlist.push({
          username: inMessage.username,
          UID: parent.UID.generateUID('users')
        });
        parent.setState( parent.state.userlist );
      } else if( inMessage.event === "remove_user" ) {
	let held_index;
        parent.state.userlist.forEach( (element, index ) => {
          if( element.username == inMessage.username ) {
            held_index = index;
            parent.state.userlist.splice( index, 1 );
          }
        });
        parent.setState( parent.state.userlist );
	parent.UID.retireUID( held_index );
      } else if( inMessage.event === "user_list" ) {
        parent.state.userlist = [];
        inMessage.user_list.map( (user) => {
          parent.state.userlist.push({
            username: user.username,
            UID: parent.UID.generateUID('users')
          });
        });
        parent.setState( parent.state.userlist );
      }
    });
  }
  render() {
    const users_dom = this.state.userlist.map( (user) =>
      <div className='user_wrapper_class' key={user.UID}>
        <div className='user_class' key={user.UID}>
          {user.username}
        </div>
      </div>
    );
    return(
      <div id='user_area' className='user_area_class'>{users_dom}</div>
    );
  }
}

class AvailGames extends React.Component {
  constructor( inGames ) {
    super( inGames );
    this.state = inGames;
  }
  update_games( inGames ) {
    this.setState( inGames )
  }
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
      <div id='avail_games_area' className='avail_games_area_class'>{avail_games_dom}</div>
    );
  }
}

function launchLoginInterface( inWebsocket ) {

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
    document.getElementById('column_avail_games_area')
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

	ReactDOM.render(
		<CurrentUsers userlist={userList} websocket={ws} />,
		document.getElementById('column_user_area')
	);

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
				document.getElementById('chat_box_wrapper')
			);
			let myChatbox = document.getElementById('chat_box');
			console.dir( myChatbox );
			myChatbox.scrollTop =  myChatbox.scrollHeight;
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
		} /*else if( inMessage.event === "user_list" ) {
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
		} */else {
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
