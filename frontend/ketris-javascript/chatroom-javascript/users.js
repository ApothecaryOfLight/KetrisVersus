'use strict';

const users = [];

function composeUserElement( user ) {
  const user_wrapper = document.createElement("div");
  user_wrapper.className = "user_wrapper_class";

  const user_element = document.createElement("div");
  user_element.className = "user_class";
  user_wrapper.appendChild( user_element );

  const user_left = document.createElement("div");
  user_left.className = "user_left_class";
  user_element.appendChild( user_left );

  const user_icon = document.createElement("div");
  user_icon.className = "user_icon_class";
  user_icon.innerText = user.user_icon;
  user_icon.style.backgroundColor = user.user_color;
  user_left.appendChild( user_icon );

  const user_right = document.createElement("div");
  user_right.className = "user_right_class";
  user_element.appendChild( user_right );
  
  const user_username = document.createElement("div");
  user_username.className = "user_username_class";
  user_username.innerText = user.username;
  user_right.appendChild( user_username );
  
  const user_score = document.createElement("div");
  user_score.className = "user_score_class";
  user_score.innerText = 700;
  user_right.appendChild( user_score );

  return user_wrapper;
}

function addUserList( event ) {
  const inMessage = JSON.parse( event.data );
  if( inMessage.event === "server_user_list" ) {
    const user_area = document.getElementById("user_area");
    while( user_area.firstChild != null ) {
      console.log("removing");
      user_area.firstChild.remove();
    }
    inMessage.user_list.map( (user) => {
      const user_ref = user_area.appendChild(composeUserElement({
        username: user.username,
        user_icon: user.username.charAt(0).toUpperCase(),
        user_color: getHexColor( user.username.charAt(0).toUpperCase() )
      }));
      users.push({username:user.username, ref:user_ref});
    });
  }
}

function addUser( event ) {
  const inMessage = JSON.parse( event.data );
  if( inMessage.event === "server_new_user" ) {
    const user_area = document.getElementById("user_area");
    const user_ref = user_area.appendChild(composeUserElement({
      username: inMessage.username,
      user_icon: inMessage.username.charAt(0).toUpperCase(),
      user_color: getHexColor( inMessage.username.charAt(0).toUpperCase() )
    }));
    users.push({username:inMessage.username, ref:user_ref});
  }
}

function removeUser( event ) {
  const inMessage = JSON.parse( event.data );
  if( inMessage.event === "server_remove_user" ) {
    console.log("remove user");
    console.dir(inMessage);
    users.forEach( (user,index) => {
      if( user.username == inMessage.username ) {
        user.ref.remove();
        users.splice(index,1);
      }
    })
  }
}

function requestUserList( inWebsocket ) {
  console.log("requestUserList");
  const requestUserList = {
    event : "requestUserList"
  }
  const requestUserList_string = JSON.stringify( requestUserList );
  inWebsocket.send( requestUserList_string );
}