'use strict';

function composeChatMessageElement( inChatMessage ) {
  const chat_line_wrapper = document.createElement("div");
  chat_line_wrapper.className = "chat_line_wrapper_class";

  const chat_line_left = document.createElement("div");
  chat_line_left.className = "chat_line_left_class";
  chat_line_wrapper.appendChild(chat_line_left);

  const chat_line_icon = document.createElement("div");
  chat_line_icon.className = "chat_line_icon_class";
  chat_line_icon.style.backgroundColor = inChatMessage.user_color;
  chat_line_icon.innerText = inChatMessage.user_icon;
  chat_line_left.appendChild(chat_line_icon);

  const chat_line_right = document.createElement("div");
  chat_line_right.className = "chat_line_right_class";
  chat_line_wrapper.appendChild( chat_line_right );

  const chat_line_username = document.createElement("div");
  chat_line_username.className = "chat_line_username_class";
  chat_line_username.innerText = inChatMessage.username;
  chat_line_right.appendChild( chat_line_username );

  const chat_line_text = document.createElement("div");
  chat_line_text.className = "chat_line_text_class";
  chat_line_text.innerText = inChatMessage.text;
  chat_line_right.appendChild( chat_line_text );

  const chat_line_timestamp = document.createElement("div");
  chat_line_timestamp.className = "chat_line_timestamp_class";
  chat_line_timestamp.innerText = inChatMessage.timestamp;
  chat_line_right.appendChild( chat_line_timestamp );

  return chat_line_wrapper;
}

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

function addToChatLog(event) {
  const inMessage = JSON.parse( event.data );
  if( inMessage.event === "server_chat_message" ) {
    const chat_message = {
      username: inMessage.username,
      user_icon: inMessage.username.charAt(0).toUpperCase(),
      user_color: getHexColor( inMessage.username.charAt(0).toUpperCase() ),
      text: inMessage.text,
      timestamp: convert_timestamp( inMessage.timestamp )
    }
    const chat_area = document.getElementById("chat_area");
    chat_area.appendChild(
      composeChatMessageElement(chat_message)
    );
    let column_chat_area_div = document.getElementById("column_chat_area");
    column_chat_area_div.scrollTop = column_chat_area_div.scrollHeight;
  }
}