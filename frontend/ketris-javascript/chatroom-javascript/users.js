'use strict';

const users = [];


/*
Function to convert a user JSON object into HTML elements.

user: User object.
*/
function composeUserElement( user ) {
  //Create an element to wrap around the user elements.
  const user_wrapper = document.createElement("div");
  user_wrapper.className = "user_wrapper_class";

  //Create an element to contain the user elements.
  const user_element = document.createElement("div");
  user_element.className = "user_class";
  user_wrapper.appendChild( user_element );

  //Create an element to contain the user elements that go on the left.
  const user_left = document.createElement("div");
  user_left.className = "user_left_class";
  user_element.appendChild( user_left );

  //Create an element to hold the user icon.
  const user_icon = document.createElement("div");
  user_icon.className = "user_icon_class";
  user_icon.innerText = user.user_icon;
  user_icon.style.backgroundColor = user.user_color;
  user_left.appendChild( user_icon );

  //Create an element to hold the user elements that go on the right.
  const user_right = document.createElement("div");
  user_right.className = "user_right_class";
  user_element.appendChild( user_right );
  
  //Create an element to hold the user's username.
  const user_username = document.createElement("div");
  user_username.className = "user_username_class";
  user_username.innerText = user.username;
  user_right.appendChild( user_username );
  
  //Create an element to hold the user's highest score.
  const user_score = document.createElement("div");
  user_score.className = "user_score_class";
  user_score.innerText = 700;
  user_right.appendChild( user_score );

  return user_wrapper;
}


/*
Function to populate all users.

Called when switching into the chat interface from the login or game interfaces.

event: Message from server containing a list of all logged-in users.
*/
function addUserList( event ) {
  //Parse the server event.
  const inMessage = JSON.parse( event.data );

  //If the message is indeed a list of users, then:
  if( inMessage.event === "server_user_list" ) {
    //Get a reference to the user area.
    const user_area = document.getElementById("user_area");

    //Delete all existing elements in the user area.
    while( user_area.firstChild != null ) {
      user_area.firstChild.remove();
    }

    //Iterate through each user.
    inMessage.user_list.map( (user) => {
      //Convert the user object into HTML elements and append them.
      const user_ref = user_area.appendChild(composeUserElement({
        username: user.username,
        user_icon: user.username.charAt(0).toUpperCase(),
        user_color: getHexColor( user.username.charAt(0).toUpperCase() )
      }));

      //Remember the username and a reference to the DOM element for later
      //deletion.
      users.push({username:user.username, ref:user_ref});
    });
  }
}


/*
Function to add a user.

event: Server event.
*/
function addUser( event ) {
  //Parse the server event.
  const inMessage = JSON.parse( event.data );

  //If indeed the server event is a new user event, then:
  if( inMessage.event === "server_new_user" ) {
    //Get a reference to the user area.
    const user_area = document.getElementById("user_area");

    //Convert the user object into HTML elements and append them to the DOM.
    const user_ref = user_area.appendChild(composeUserElement({
      username: inMessage.username,
      user_icon: inMessage.username.charAt(0).toUpperCase(),
      user_color: getHexColor( inMessage.username.charAt(0).toUpperCase() )
    }));

    //Remember the username and a reference to the DOM element for later
    //deletion.
    users.push({username:inMessage.username, ref:user_ref});
  }
}


/*
Function to remove a user from the list when they log out/disconnect.
*/
function removeUser( event ) {
  //Parse the event.
  const inMessage = JSON.parse( event.data );

  //If indeed the event is a remove user event, then:
  if( inMessage.event === "server_remove_user" ) {
    //Iterate through the users locally listed.
    users.forEach( (user,index) => {
      //If this user is the user to delete, then:
      if( user.username == inMessage.username ) {
        //Remove the HTML element itself.
        user.ref.remove();

        //Remove the user from the list of users.
        users.splice(index,1);

        return;
      }
    })
  }
}


/*
Function to request from the server a full list of logged-in users.

inWebsocket: Connection to chat server.
*/
function requestUserList( inWebsocket ) {
  //Create the request user list object.
  const requestUserList = {
    event : "requestUserList"
  }
  const requestUserList_string = JSON.stringify( requestUserList );

  //Send the request.
  inWebsocket.send( requestUserList_string );
}