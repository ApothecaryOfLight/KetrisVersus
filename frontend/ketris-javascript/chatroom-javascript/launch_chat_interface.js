'use strict';

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