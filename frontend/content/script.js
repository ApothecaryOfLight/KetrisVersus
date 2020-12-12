'use strict';

/*
React
*/

const e = React.createElement;

const colors = {
  "A": "#ffff66", "B": "#66ff99", "C": "#33ccff", "D": "#9966ff",
  "E": "#3366cc", "F": "#00cc66", "G": "#ffa07a", "H": "#ffa500",
  "I": "#f0e68c", "J": "#3cb371", "K": "#e0ffff", "L": "#87ceeb",
  "M": "#7b68ee", "N": "#e6e6fa", "O": "#d8bfd8", "P": "#9370db",
  "Q": "#ffc0cb", "R": "#faebd7", "S": "#c0c0c0", "T": "#deb887",
  "U": "#daa520", "V": "#a52a2a", "W": "#800000", "X": "#87cefa",
  "Y": "#4169e1", "Z": "#ee82ee"
}

function getColor( inLetter ) {
  //console.log( "background:" + colors[inLetter] );
  return {background: colors[inLetter]};
}

class UID {
  constructor() {
    this.UIDs = [];
  }
  generateUID( inField ) {
    console.log( "Generating first UID of field " + inField + "." );
    if( !this.UIDs[inField] ) {
      this.UIDs[inField] = {
      counter: 1,
      retiredIDs : []
      };
      return 0;
    } else if( this.UIDs[inField].retiredIDs.length ) {
      console.log( "Issuing retired UID of field " + inField + "." );
      return this.UIDs[inField].retiredIDs.pop();
    } else {
      console.log( "Generating new UID of field " + inField + "." );
      return this.UIDs[inField].counter++;
    }
  }
  retireUID( inField, inUID ) {
    console.log( "reitiring UID " + inUID + " of " + inField );
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
      if( inMessage.event === "server_chat_message" ) {
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
      if( inMessage.event === "server_new_user" ) {
        parent.state.userlist.push({
          username: inMessage.username,
          user_icon: inMessage.username.charAt(0).toUpperCase(),
          user_color: getColor( inMessage.username.charAt(0).toUpperCase() ),
          UID: parent.UID.generateUID('users')
        });
        parent.setState( parent.state.userlist );
      } else if( inMessage.event === "server_remove_user" ) {
	let held_index;
        parent.state.userlist.forEach( (element, index ) => {
          if( element.username == inMessage.username ) {
            held_index = element.UID;
            parent.state.userlist.splice( index, 1 );
          }
        });
        parent.setState( parent.state.userlist );
	parent.UID.retireUID( 'users', held_index );
      } else if( inMessage.event === "server_user_list" ) {
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
      //console.log( "AvailGames message check: " );
      //console.log( event.data );
      //console.dir( inMessage );
      //console.log( inMessage.event );
      if( inMessage.event === "server_list_game" ) {
        console.log( "server_list_game event!" );
        parent.state.inGames.push({
          game_name: inMessage.game_name,
          game_icon: inMessage.game_name.charAt(0).toUpperCase(),
          game_color: getColor( inMessage.game_name.charAt(0).toUpperCase() ),
          game_id: inMessage.game_id,
          UID: inMessage.game_id //guaranteed unique by server
        });
        parent.setState( parent.state.inGames );
      } else if( inMessage.event === "server_delist_game" ) {
        parent.state.inGames.forEach( ( element, index ) => {
          if( element.game_id === inMessage.game_id ) {
            parent.state.inGames.splice( index, 1 );
          }
        });
        parent.setState( parent.state.inGames );
      } else if( inMessage.event === "server_game_list" ) {
        parent.state.inGames = [];
        inMessage.game_list.map( (game) => {
          parent.state.inGames.push({
            game_name: game.game_name,
            game_icon: game.game_name.charAt(0).toUpperCase(),
            game_color: getColor( game.game_name.charAt(0).toUpperCase() ),
            game_id: game.game_id,
            UID: game.game_id
          });
        });
        parent.setState( parent.state.inGames );
      }
    });
  };
  join_game( inGameID, inGameName ) {
    console.log( "Joining game ID: " + inGameID + " GameName: " + inGameName + "." );
    this.state.websocket.send(JSON.stringify({
      event: "client_enter_game",
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



/*
Game interface
*/
function launchGameInterface( inIPAddress, inGameID ) {
  console.log( "Launching game interface!" );
  let login_interface = document.getElementById('login_interface');
  let chat_interface = document.getElementById('chat_interface');
  let game_interface = document.getElementById('game_interface');
  login_interface.style.display = "none";
  chat_interface.style.display = "none";
  game_interface.style.display = "flex";
  launchKetris( inIPAddress, inGameID );
}

function doLogObject( inObj ) {
  inObj.forEach( (element) => {
    console.log( element );
  });
}

function doShowContactDevPopup( event ) {
  
}

function doHideContactDevPopup( event ) {
  
}

function doSendMessageToDev( ws, inAuthor, inMessage ) {
  console.log( "Sending..." + inAuthor + "/" + inMessage );
  if( inAuthor == "" || inMessage == "" ) {
    console.log( "Please fill out both fields" );
    return;
  }
  ws.send( JSON.stringify({
    event: "client_dev_message",
    author: inAuthor,
    message: inMessage
  }));
}



/*
Chat Interface
*/
function send_chat_message( ws, inMessage ) {
  const send_message = {
    event : "client_chat_message",
    text : inMessage
  }
  const send_message_json = JSON.stringify( send_message );
  ws.send( send_message_json );
}

function ws_event_server_enter_game( event ) {
  console.log( "ws_event_server_enter_game" );
  const inMessage = JSON.parse( event.data );
  console.dir( inMessage );
  if( inMessage.event === "server_enter_game" ) {
    launchGameInterface( inMessage.ip, inMessage.game_id );
  }
}

function event_send_button( event ) {
  console.log( "event_send_button" );

  //let mySendButton = document.getElementById("send_button");
  let myInputText = document.getElementById( "input_text" );
  const input_text = myInputText.value;
  if( input_text != "" ) {
    send_chat_message( this, input_text );
  }
  myInputText.value = "";
  myInputText.focus()
}

function event_enter_send_message( event ) {
  console.log( "event_enter_send_message" );

  let myInputText = document.getElementById("input_text");
  if( event.key === "Enter" ) {
    event.preventDefault();
    console.log( "enter!" );
    const textfield = myInputText.value;
    if( textfield != "" ) {
      send_chat_message( this, textfield );
    }
    myInputText.value = "";
  }
}

function event_start_new_game_button( event ) {
  console.log( "event_start_new_game_button" );
  let myNewGameButton = document.getElementById("start_new_game_button");
  this.send( JSON.stringify({
    event: "client_new_game"
  }));
}

/*
Chat interface Contact dev events
*/
function event_launch_contact_dev_popup( event ) {
  console.log( "event_launch_contact_dev_popup" );

  let contact_dev_popup_overlay = document.getElementById('contact_dev_popup_overlay');
  contact_dev_popup_overlay.style.display = "flex";
}

function event_close_contact_dev_popup( event ) {
  console.log( "event_close_contact_dev_popup" );

  let contact_dev_popup_exit_button = document.getElementById('contact_dev_popup_exit_button');
  contact_dev_popup_overlay.style.display = "none";
}

function event_send_contact_dev_message( event ) {
  console.log( "event_send_contact_dev_message" );

  let contact_dev_popup_nameorg_field = document.getElementById('contact_dev_popup_nameorg_field');
  let contact_dev_popup_message_field = document.getElementById('contact_dev_popup_message_field');
  const author = contact_dev_popup_nameorg_field.value;
  const message = contact_dev_popup_message_field.value;
  doSendMessageToDev( this, author, message );
  contact_dev_popup_nameorg_field = "";
  contact_dev_popup_message_field = "";
  contact_dev_popup_overlay.style.display = "none";
}

function launch_ChatInterface( ws ) {
  console.log( "Launching chat interface!" );

  let login_interface = document.getElementById('login_interface');
  let chat_interface = document.getElementById('chat_interface');
  login_interface.style.display = "none";
  chat_interface.style.display = "flex";

  attach_event( 'contact_dev_button', 'click', "event_launch_contact_dev_popup" );
  attach_event( 'contact_dev_popup_exit_button', 'click', "event_close_contact_dev_popup" );
  attach_event( 'contact_dev_popup_send_button', 'click', "event_send_contact_dev_message" );
  attach_ws_event( ws, 'message', "ws_event_server_enter_game" );
  attach_key_event( 'input_text', 'keydown', "Enter", "event_enter_send_message" );
  attach_event( 'start_new_game_button', 'click', 'event_start_new_game_button' );
  attach_event( 'send_button', 'click', 'event_send_button' );

  let chatLog = [];
  const userList = [];
  let gameList = [];
  const myUID = new UID();
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
}

function cleanup_ChatInterface() {
  console.log( "cleanup_ChatInterface" );
  detach_event( 'contact_dev_button', 'click', "event_launch_contact_dev_popup" );
  detach_event( 'contact_dev_popup_exit_button', 'click', "event_close_contact_dev_popup" );
  detach_event( 'contact_dev_popup_send_button', 'click', "event_send_contact_dev_message" );
  detach_ws_event( ws, 'message', "ws_event_server_enter_game" );
  detach_key_event( 'input_text', 'keydown', "Enter", "event_enter_send_message" );
  detach_event( 'start_new_game_button', 'click', 'event_start_new_game_button' );
  detach_event( 'send_button', 'click', 'event_send_button' );
}



/*
Login interface
*/
function doLogin( websocket, username, password ) {
  const login = {
    "event" : "client_login",
    "username" : username,
    "password" : password
  }
  const login_text = JSON.stringify( login );
  websocket.send( login_text );
}

function doCreateAccount( websocket, username, password ) {
  const account_creation = {
    "event": "client_account_creation",
    "username": username,
    "password": password
  }
  const account_creation_text = JSON.stringify( account_creation );
  websocket.send( account_creation_text );
}

function ws_event_websocket_opened( event ) {
  console.log( "Websocket opened!" );
  event.srcElement.removeEventListener( 'click', event_listener_dictionary["event_websocket_opened"] );
}

function event_login_click( event ) {
  let username_box = document.getElementById('login_username');
  let password_box = document.getElementById('login_password');
  let username = username_box.value;
  let password = password_box.value;
  if( username != "" && password != "" ) {
    console.log( "Attempting login!" );
    doLogin( this, username, password );
  }
}

function event_account_creation_click( event ) {
  let username_box = document.getElementById('login_username');
  let password_box = document.getElementById('login_password');
  let username = username_box.value;
  let password = password_box.value;
  if( username != "" && password != "" ) {
    console.log( "Attempting account creation!" );
    doCreateAccount( this, username, password );
  }
}

function ws_event_server_login_approval( event ) {
  if( event.data === "server_login_approved" ) {
    console.log( "Login approved!" );
    cleanup_LoginInterface( this );
    launch_ChatInterface( this );
  }
}

function launch_LoginInterface( ws ) {
  console.log( "Launching login interface." );

  attach_event( "login_button", 'click', "event_login_click" );
  attach_event( "create_account_button", 'click', "event_account_creation_click" );
  attach_ws_event( ws, 'open', "ws_event_websocket_opened" );
  attach_ws_event( ws, 'message', "ws_event_server_login_approval" );

  let login_interface = document.getElementById('login_interface');
  let chat_interface = document.getElementById('chat_interface');
  let contact_dev_popup = document.getElementById('contact_dev_popup');

  chat_interface.style.display = "none";
}

function cleanup_LoginInterface( ws ) {
  console.log( "Cleaning up login interface." );

  detach_event( "login_button", 'click', "event_login_click" );
  detach_event( "create_account_button", 'click', "event_account_creation_click" );
  detach_ws_event( ws, 'open', "ws_event_websocket_opened" );
  detach_ws_event( ws, 'message', "ws_event_server_login_approval" );
}

function launch_GameInterface() {

}

function cleanup_GameInterface() {

}



/*
Core functionality
*/
let event_listener_dictionary = {};

function build_event_listener_dictionary( ws ) {
  /* Login events */
  event_listener_dictionary["ws_event_websocket_opened"] = ws_event_websocket_opened.bind( ws );
  event_listener_dictionary["event_login_click"] = event_login_click.bind( ws );
  event_listener_dictionary["event_account_creation_click"] = event_account_creation_click.bind( ws );
  event_listener_dictionary["ws_event_server_login_approval"] = ws_event_server_login_approval.bind( ws );

  /* Chat events */
  event_listener_dictionary["ws_event_server_enter_game"] = ws_event_server_enter_game.bind( ws );
  event_listener_dictionary["event_send_button"] = event_send_button.bind( ws );
  event_listener_dictionary["event_enter_send_message"] = event_enter_send_message.bind( ws );
  event_listener_dictionary["event_start_new_game_button"] = event_start_new_game_button.bind( ws );

  /* Chat events: Contact dev popup*/
  event_listener_dictionary["event_launch_contact_dev_popup"] = event_launch_contact_dev_popup.bind( ws );
  event_listener_dictionary["event_close_contact_dev_popup"] = event_close_contact_dev_popup.bind( ws );
  event_listener_dictionary["event_send_contact_dev_message"] = event_send_contact_dev_message.bind( ws );
}

function attach_event( DOM_ID, event, function_name ) {
  console.log( "Attaching to object " + DOM_ID + " on " + event + " with " + function_name );
  try {
    if( DOM_ID === "undefined" ) { throw "DOM Element undefined!"; }
    if( event === "undefined" ) { throw "Event undefined!"; }
    if( function_name === "undefined" ) { throw "Function undefined!"; }
    let dom_element_handle = document.getElementById( DOM_ID );
    dom_element_handle.addEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}

function detach_event( DOM_ID, event, function_name ) {
  console.log( "Detaching from object " + DOM_ID + " on " + event + " with " + function_name );
  try {
    if( DOM_ID === "undefined" ) { throw "DOM Element undefined!"; }
    if( event === "undefined" ) { throw "Event undefined!"; }
    if( function_name === "undefined" ) { throw "Function undefined!"; }
    let dom_element_handle = document.getElementById( DOM_ID );
    dom_element_handle.removeEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}

function attach_key_event( DOM_ID, event, key, function_name ) {
  console.log(
    "Attaching keypress to object " + DOM_ID + " on " +
    event + " key " + key + " with " + function_name
  );
  try {
    if( DOM_ID === "undefined" ) { throw "DOM Element undefined!"; }
    if( event === "undefined" ) { throw "Event undefined!"; }
    if( function_name === "undefined" ) { throw "Function undefined!"; }
    if( key === "undefined" ) { throw "Key undefined!"; }
    let dom_element_handle = document.getElementById( DOM_ID );
    dom_element_handle.addEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}

function detach_key_event( DOM_ID, event, key, function_name ) {
  console.log(
    "Detaching keypress from object " + DOM_ID + " on " +
    event + " key " + key + " with " + function_name
  );
  try {
    if( DOM_ID === "undefined" ) { throw "DOM Element undefined!"; }
    if( event === "undefined" ) { throw "Event undefined!"; }
    if( function_name === "undefined" ) { throw "Function undefined!"; }
    if( key === "undefined" ) { throw "Key undefined!"; }
    let dom_element_handle = document.getElementById( DOM_ID );
    dom_element_handle.removeEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}

function attach_ws_event( ws, event, function_name ) {
  console.log( "Attaching to websocket event on " + event + " with " + function_name );
  try {
    if( ws === "undefined" ) { throw "Websocket undefined!"; }
    if( event === "undefined" ) { throw "Event undefined!"; }
    if( function_name === "undefined" ) { throw "Function undefined!"; }
    ws.addEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}

function detach_ws_event( ws, event, function_name ) {
  console.log( "Detaching from websocket event on " + event + " with " + function_name );
  try {
    if( ws === "undefined" ) { throw "Websocket undefined!"; }
    if( event === "undefined" ) { throw "Event undefined!"; }
    if( function_name === "undefined" ) { throw "Function undefined!"; }
    ws.removeEventListener( event, event_listener_dictionary[ function_name ] );
  } catch ( error ) {
    console.error( error );
  }
}

document.addEventListener( "DOMContentLoaded", function(event) {
  console.log( "DOMContentLoaded" );
  var ws;
  try{
    ws = new WebSocket( 'ws://54.149.165.92:3000' );
  } catch( error ) {
    console.error( error );
  }
  build_event_listener_dictionary( ws );
  launch_LoginInterface( ws );
});
