'use strict';

const e = React.createElement;

let colors = {
  "A": "#ffff66",
  "B": "#66ff99",
  "C": "#33ccff",
  "D": "#9966ff",
  "E": "#3366cc",
  "F": "#00cc66",
  "G": "#ffa07a",
  "H": "#ffa500",
  "I": "#f0e68c",
  "J": "#3cb371",
  "K": "#e0ffff",
  "L": "#87ceeb",
  "M": "#7b68ee",
  "N": "#e6e6fa",
  "O": "#d8bfd8",
  "P": "#9370db",
  "Q": "#ffc0cb",
  "R": "#faebd7",
  "S": "#c0c0c0",
  "T": "#deb887",
  "U": "#daa520",
  "V": "#a52a2a",
  "W": "#800000",
  "X": "#87cefa",
  "Y": "#4169e1",
  "Z": "#ee82ee"
}

function getColor( inLetter ) {
  console.log( "background:" + colors[inLetter] );
  return {background: colors[inLetter]};
}

class UID {
	constructor() {
		this.UIDs = [];
	}
	generateUID( inField ) {
		console.log( "Generating UID." );
		if( !this.UIDs[inField] ) {
			this.UIDs[inField] = {
				counter: 1,
				retiredIDs : []
			};
			return 0;
		} else if( this.UIDs[inField].retiredIDs.length ) {
			return this.UIDs[inField].retiredIDs.pop();
		} else {
			return this.UIDs[inField].counter++;
		}
	}
	retireUID( inField, inUID ) {
		console.log( "reitiringUID " + inUID + " of " + inField );
		this.UIDs[inField].retiredIDs.push( inUID );
	}
}

class ChatRoom extends React.Component {
  constructor( chatmessages, websocket ) {
    super( chatmessages, websocket );
    this.state = {...chatmessages};
    this.UID = new UID;
  }
  componentDidMount() {
    this.setState( this.state.chatmessages );
    let parent = this;
    this.state.websocket.addEventListener('message', function(event) {
      const inMessage = JSON.parse( event.data );
      if( inMessage.event === "chat_message" ) {
        parent.state.chatmessages.push({
          username: inMessage.username,
          user_icon: inMessage.username.charAt(0).toUpperCase(),
          user_color: getColor( inMessage.username.charAt(0).toUpperCase() ),
          text: inMessage.text,
          UID: parent.UID.generateUID('chats')
        });
        parent.setState( parent.state.chatmessages );
        let column_chat_area_div = document.getElementById("column_chat_area");
	column_chat_area_div.scrollTop = column_chat_area_div.scrollHeight;
      }
    });
  }
  render() {
    const chat_dom = this.state.chatmessages.map( (chatmessage) =>
      <div className='chat_line_wrapper_class' key={chatmessage.UID}>
        <div className='chat_line_class'>
          <div className='chat_line_left_class'>
            <div className='chat_line_icon_class' style={chatmessage.user_color}>
              {chatmessage.user_icon}
            </div>
          </div>
          <div className='chat_line_right_class'>
            <div className='chat_line_username_class'>
              {chatmessage.username}:
            </div>
            <div className='chat_line_text_class'>
              {chatmessage.text}
            </div>
            <div className='chat_line_timestamp_class'>
              Timestamp
            </div>
          </div>
        </div>
      </div>
    );
    return(
      <div id='chat_area' className='chat_area_class'>{chat_dom}</div>
    );
  }
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
          user_icon: inMessage.username.charAt(0).toUpperCase(),
          user_color: getColor( inMessage.username.charAt(0).toUpperCase() ),
          UID: parent.UID.generateUID('users')
        });
        parent.setState( parent.state.userlist );
      } else if( inMessage.event === "remove_user" ) {
	let held_index;
        parent.state.userlist.forEach( (element, index ) => {
          if( element.username == inMessage.username ) {
            held_index = element.UID;
            parent.state.userlist.splice( index, 1 );
          }
        });
        parent.setState( parent.state.userlist );
	parent.UID.retireUID( 'users', held_index );
      } else if( inMessage.event === "user_list" ) {
        parent.state.userlist = [];
        inMessage.user_list.map( (user) => {
          parent.state.userlist.push({
            username: user.username,
            user_icon: user.username.charAt(0).toUpperCase(),
            user_color: getColor( user.username.charAt(0).toUpperCase() ),
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
        <div className='user_class'>
          <div className='user_left_class'>
            <div className='user_icon_class' style={user.user_color}>
              {user.user_icon}
            </div>
          </div>
          <div className='user_right_class'>
            <div className='user_username_class'>
              {user.username}
            </div>
            <div className='user_score_class'>
              700
            </div>
          </div>
        </div>
      </div>
    );
    return(
      <div id='user_area' className='user_area_class'>{users_dom}</div>
    );
  }
}

function join_game( inGameID ) {
  return function( inGameID ) {
    console.log( "jinning: " + inGameID );
    console.dir( inGameID );
  }
}

class AvailGames extends React.Component {
  constructor( inGames, websocket ) {
    super( inGames, websocket );
    this.state = {...inGames};
    this.UID = new UID;
  }
  componentDidMount() {
    this.setState( this.state.inGames );
    let parent = this;
    this.state.websocket.addEventListener('message', function(event) {
      const inMessage = JSON.parse( event.data );
	console.dir( event.data );
      if( inMessage.event === "new_game" ) {
        parent.state.inGames.push({
          game_name: inMessage.game_name,
          game_icon: inMessage.game_name.charAt(0).toUpperCase(),
          game_color: getColor( inMessage.game_name.charAt(0).toUpperCase() ),
          game_id: inMessage.game_id,
          UID: parent.UID.generateUID('games')
        });
        parent.setState( parent.state.inGames );
      } else if( inMessage.event === "remove_game" ) {
        let held_index;
        parent.state.inGames.forEach( (element,index) => {
          if( element.game_name === inMessage.game_name ) {
            held_index = element.UID;
            parent.state.inGames.splice( index, 1 );
          }
        });
        parent.setState( parent.state.inGames );
        parent.UID.retireUID( 'games', held_index );
      } else if( inMessage.event === "game_list" ) {
        parent.state.inGames = [];
        inMessage.game_list.map( (game) => {
          parent.state.inGames.push({
            game_name: game.game_name,
            game_icon: game.game_name.charAt(0).toUpperCase(),
            game_color: getColor( game.game_name.charAt(0).toUpperCase() ),
            game_id: game.game_id,
            UID: parent.UID.generateUID('games')
          });
        });
        parent.setState( parent.state.inGames );
      }
    });
  };
  join_game( inGameID, inGameName ) {
    console.log( "Joining game:" + inGameID );
    console.dir( inGameID );
    console.dir( inGameName );
    console.dir( this );
    this.state.websocket.send(JSON.stringify({
      event: "enter_game",
      game_id: inGameID,
      game_name: inGameName
    }));
  }
  render() {
    const avail_games_dom = this.state.inGames.map( (avail_game) =>
      <div className='avail_game_wrapper_class' key={avail_game.UID}>
        <div className='avail_game_class'>
          <div className='avail_game_left_class'>
            <div className='avail_game_icon_class' style={avail_game.game_color}>
              {avail_game.game_icon}
            </div>
            <div className='avail_game_username_class'>
              Started By: {avail_game.game_name}
            </div>
            <div className='avail_game_timestamp_class'>
              Timestamp
            </div>
          </div>
          <div className='avail_game_right_class'>
            <button className='avail_game_join_game_button_class button_class'
              onClick={()=> this.join_game(avail_game.game_id,avail_game.game_name) }
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    );
    return(
      <div id='avail_games_area' className='avail_games_area_class'>{avail_games_dom}</div>
    );
  }
}

function launchGameInterface( inIPAddress, inGameID ) {
  console.log( "Launching game interface!" );
  let login_interface = document.getElementById('login_interface');
  let chat_interface = document.getElementById('chat_interface');
  let game_interface = document.getElementById('game_interface');
  login_interface.style.display = "none";
  chat_interface.style.display = "none";
  game_interface.style.display = "flex";
  launchKetris( inIPAddress, inGameID );
  //var myKetrisThread = new Worker('script-ketris.js');
  //myKetrisThread.postMessage([inIPAddress,inGameID]);
}

function launchLoginInterface( inWebsocket ) {
  
}

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

	let body = document.body;
	console.dir( body );
	body.style["background"] = "white";

	let chatLog = [];
	const userList = [];
	let gameList = [];
	const myUID = new UID();
	//ws.removeEventListener( 'message' );

	ReactDOM.render(
		<CurrentUsers userlist={userList} websocket={ws} />,
		document.getElementById('column_user_area')
	);
        ReactDOM.render(
		<AvailGames inGames={gameList} websocket={ws} />,
		document.getElementById('column_avail_games_area')
        );
	ReactDOM.render(
		<ChatRoom chatmessages={chatLog} websocket={ws} />,
		document.getElementById('column_chat_area')
	);

	ws.addEventListener( 'message', function(event) {
		const inMessage = JSON.parse( event.data );
		console.dir( inMessage );
		if( inMessage.event === "enter_game_approval" ) {
			launchGameInterface( inMessage.ip, inMessage.game_id );
		}
	});
	/*ws.addEventListener( 'message', function(event) {
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
		} else {
			console.log( "Unrecognized message." );
			console.dir( inMessage );
		}
	});*/

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
