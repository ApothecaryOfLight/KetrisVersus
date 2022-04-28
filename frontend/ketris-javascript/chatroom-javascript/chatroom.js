'use strict';


/*
React component to manage games posted by other players.
*/
class ChatRoom extends React.Component {
    constructor( chatmessages, websocket ) {
      super( chatmessages, websocket );
      this.state = {...chatmessages};
      this.UID = new UID;
      window.ChatRoom = this;
    }

    updateWebsocket( websocket ) {
      this.state.websocket = websocket;
      this.state.websocket.addEventListener('message', function(event) {
        //Parse the JSON object.
        const inMessage = JSON.parse( event.data );

        //Check the event type to determine how the message should be acted upon.
        if( inMessage.event === "server_chat_message" ) {
          //A chat message has been received.
          
          //Get the user's timezone offset in hours.
          const user_timezone_hours = new Date().getTimezoneOffset()/60;

          //Convert the server's timestamp into a JavaScript timestamp.
          const timestamp = new Date(inMessage.timestamp);

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

          //Add it to the chat messages stored by React.
          parent.ChatRoom.props.chatmessages.push({
            username: inMessage.username,
            user_icon: inMessage.username.charAt(0).toUpperCase(),
            user_color: getColor( inMessage.username.charAt(0).toUpperCase() ),
            text: inMessage.text,
            UID: parent.ChatRoom.UID.generateUID('chats'),
            timestamp: final_timestamp_string
          });

          //Have React render the updated component.
          parent.ChatRoom.setState( parent.ChatRoom.props.chatmessages );

          //Set the scroll position of the chat log to the most recent message
          //received.
          let column_chat_area_div = document.getElementById("column_chat_area");
          column_chat_area_div.scrollTop = column_chat_area_div.scrollHeight;
        }
      });
    }


    //Call upon React being ready to attach event listeners to the component.
    componentDidMount() {
      this.setState( this.state.chatmessages );
      let parent = this;

      //Attach the Websocket listener events to this React component.
      this.state.websocket.addEventListener('message', function(event) {
        //Parse the JSON object.
        const inMessage = JSON.parse( event.data );

        //Check the event type to determine how the message should be acted upon.
        if( inMessage.event === "server_chat_message" ) {
          //A chat message has been received.
          
          //Get the user's timezone offset in hours.
          const user_timezone_hours = new Date().getTimezoneOffset()/60;

          //Convert the server's timestamp into a JavaScript timestamp.
          const timestamp = new Date(inMessage.timestamp);

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

          //Add it to the chat messages stored by React.
          parent.state.chatmessages.push({
            username: inMessage.username,
            user_icon: inMessage.username.charAt(0).toUpperCase(),
            user_color: getColor( inMessage.username.charAt(0).toUpperCase() ),
            text: inMessage.text,
            UID: parent.UID.generateUID('chats'),
            timestamp: final_timestamp_string
          });

          //Have React render the updated component.
          parent.setState( parent.state.chatmessages );

          //Set the scroll position of the chat log to the most recent message
          //received.
          let column_chat_area_div = document.getElementById("column_chat_area");
          column_chat_area_div.scrollTop = column_chat_area_div.scrollHeight;
        }
      });
    }

    
    //This function builds and renders the list of available games.
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
                {chatmessage.timestamp}
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