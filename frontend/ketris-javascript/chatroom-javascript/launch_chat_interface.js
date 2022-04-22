'use strict';


/*
Launch the chat interface.
*/
function launch_ChatInterface( ws ) {
  console.log( "Launching chat interface!" );

  //Show the chat interface and hide the login and game interfaces.
  switchInterface( "chat", ws );

  //Set up the React components and render them.
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