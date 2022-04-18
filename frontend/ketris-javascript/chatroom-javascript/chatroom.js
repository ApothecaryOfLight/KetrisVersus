'use strict';


/*
React component to manage games posted by other players.
*/
class ChatRoom extends React.Component {
    constructor( chatmessages, websocket ) {
      super( chatmessages, websocket );
      this.state = {...chatmessages};
      this.UID = new UID;
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
          //A chat message has been received. Add it to the chat messages stored by
          //React.
          parent.state.chatmessages.push({
            username: inMessage.username,
            user_icon: inMessage.username.charAt(0).toUpperCase(),
            user_color: getColor( inMessage.username.charAt(0).toUpperCase() ),
            text: inMessage.text,
            UID: parent.UID.generateUID('chats')
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