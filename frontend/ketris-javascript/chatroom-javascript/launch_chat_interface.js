'use strict';


/*
Launch the chat interface.
*/
function launch_ChatInterface( chatroomWebsocket ) {
  console.log( "Launching chat interface!" );

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
}