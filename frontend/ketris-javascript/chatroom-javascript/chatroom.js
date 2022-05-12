'use strict';


/*
Create a HTML elements to contain a chat message.

inChatMessage: JSON object from server containing all information about a chat
message.
*/
function composeChatMessageElement( inChatMessage ) {
  //Create an element to contain the chat line.
  const chat_line_wrapper = document.createElement("div");
  chat_line_wrapper.className = "chat_line_wrapper_class";

  //Create an element to hold the elements of the chat line on the left.
  const chat_line_left = document.createElement("div");
  chat_line_left.className = "chat_line_left_class";
  chat_line_wrapper.appendChild(chat_line_left);

  //Create an element to hold the icon (letter) of the chatting user.
  const chat_line_icon = document.createElement("div");
  chat_line_icon.className = "chat_line_icon_class";
  chat_line_icon.style.backgroundColor = inChatMessage.user_color;
  chat_line_icon.innerText = inChatMessage.user_icon;
  chat_line_left.appendChild(chat_line_icon);

  //Create an element to hold the elements of the chat line on the right.
  const chat_line_right = document.createElement("div");
  chat_line_right.className = "chat_line_right_class";
  chat_line_wrapper.appendChild( chat_line_right );

  //Create an element to hold the username of the chatting user.
  const chat_line_username = document.createElement("div");
  chat_line_username.className = "chat_line_username_class";
  chat_line_username.innerText = inChatMessage.username;
  chat_line_right.appendChild( chat_line_username );

  //Create an element to hold the text of the chat.
  const chat_line_text = document.createElement("div");
  chat_line_text.className = "chat_line_text_class";
  chat_line_text.innerText = inChatMessage.text;
  chat_line_right.appendChild( chat_line_text );

  //Create an element to hold the timestamp of the chat.
  const chat_line_timestamp = document.createElement("div");
  chat_line_timestamp.className = "chat_line_timestamp_class";
  chat_line_timestamp.innerText = inChatMessage.timestamp;
  chat_line_right.appendChild( chat_line_timestamp );

  return chat_line_wrapper;
}


/*
Convert the given timestamp into a Human readable format.

inTimestamp: Timestamp value.
*/
function convert_timestamp( inTimestamp ) {
  //Get the user's timezone offset in hours.
  const user_timezone_hours = new Date().getTimezoneOffset()/60;

  //Convert the server's timestamp into a JavaScript timestamp.
  const timestamp = new Date( inTimestamp );

  //Get the hours value of the server's timestamp.
  const timestamp_hour = timestamp.getHours();
  //Subtract the server's hour timestamp by the user's time zone.
  timestamp.setHours( timestamp_hour - user_timezone_hours );

  //Convert the timestamp into Strings for the date and the time.
  const date_string = timestamp.toDateString();
  const time_string = timestamp.toLocaleTimeString('en-US');

  //Get whether its ante or post meridian (AM or PM).
  const meridian = time_string.substring(
    time_string.length - 2,
    time_string.length
  );

  //Stringbash the final timestamp string together, removing the seconds
  //value in the process.
  const final_timestamp_string =
    date_string + " " +
    time_string.substr( 0, time_string.length - 6 ) +
    " " + meridian;

  return final_timestamp_string;
}


/*
Function to add a chat message JSON object to the DOM.

event: JSON object containing the server event.
*/
function addToChatLog(event) {
  //Parse the server event.
  const inMessage = JSON.parse( event.data );

  //If indeed the event is a new chat message, then:
  if( inMessage.event === "server_chat_message" ) {
    //Create a JSON object from the chat message.
    const chat_message = {
      username: inMessage.username,
      user_icon: inMessage.username.charAt(0).toUpperCase(),
      user_color: getHexColor( inMessage.username.charAt(0).toUpperCase() ),
      text: inMessage.text,
      timestamp: convert_timestamp( inMessage.timestamp )
    }

    //Get a reference to the chat area.
    const chat_area = document.getElementById("chat_area");

    //Convert the JSON object into HTML elements and append them to the DOM.
    chat_area.appendChild(
      composeChatMessageElement(chat_message)
    );

    //Get a reference to the chat column and scroll to bottom to ensure that the
    //user is always able to see the latest chats when they happen.
    let column_chat_area_div = document.getElementById("column_chat_area");
    column_chat_area_div.scrollTop = column_chat_area_div.scrollHeight;
  }
}