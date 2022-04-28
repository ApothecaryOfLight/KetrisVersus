'use strict';


/*
Launch the chat interface.
*/
function launch_ChatInterface( chatroomWebsocket, user_obj ) {
  if( !user_obj.hasReactMounted ) {
    //Set up the React components and render them.
    let chatLog = [];
    const userList = [];
    let gameList = [];
    const myUID = new UID();
    ReactDOM.render(
      <CurrentUsers userlist={userList} websocket={chatroomWebsocket} />,
      document.getElementById('column_user_area')
    );
    ReactDOM.render(
      <AvailGames inGames={gameList} websocket={chatroomWebsocket} />,
      document.getElementById('column_avail_games_area')
    );
    ReactDOM.render(
      <ChatRoom chatmessages={chatLog} websocket={chatroomWebsocket} />,
      document.getElementById('column_chat_area')
    );
    user_obj.hasReactMounted = true;
  } else {
    window.ChatRoom.updateWebsocket( chatroomWebsocket );
    window.AvailGames.updateWebsocket( chatroomWebsocket );
    window.CurrentUsers.updateWebsocket( chatroomWebsocket );
  }
}