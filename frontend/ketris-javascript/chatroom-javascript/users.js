'use strict';


/*
React component to manage logged-in users.
*/
class CurrentUsers extends React.Component {
  constructor( userlist, websocket ) {
  super( userlist, websocket );
    this.state = {...userlist};
    this.UID = new UID;
    window.CurrentUsers = this;
  }

  updateWebsocket( websocket ) {
    this.state.websocket = websocket;

    parent.CurrentUsers.state.userlist.splice(
      0,
      parent.CurrentUsers.state.userlist.length
    );

    this.state.websocket.addEventListener('message', function(event) {
      //Parse the JSON object.
      const inMessage = JSON.parse( event.data );

      //Check the event type to determine how the message should be acted upon.
      if( inMessage.event === "server_new_user" ) {
        //Add a new user to the list of users.
        parent.CurrentUsers.state.userlist.push({
          username: inMessage.username,
          user_icon: inMessage.username.charAt(0).toUpperCase(),
          user_color: getColor( inMessage.username.charAt(0).toUpperCase() ),
          UID: parent.CurrentUsers.UID.generateUID('users')
        });
        
        //Have React render the user lists.
        parent.CurrentUsers.setState( parent.CurrentUsers.state.userlist );
      } else if( inMessage.event === "server_remove_user" ) {
        //Remove a user who has disconnected.
        let held_index;

        //Iterate through the list of users and remove that user.
        parent.CurrentUsers.state.userlist.forEach( (element, index ) => {
          if( element.username == inMessage.username ) {
            held_index = element.UID;
            parent.CurrentUsers.state.userlist.splice( index, 1 );
          }
        });

        //Have React render the user lists.
        parent.CurrentUsers.setState( parent.CurrentUsers.state.userlist );

        //Retire that user's ID.
        parent.CurrentUsers.UID.retireUID( 'users', held_index );
      } else if( inMessage.event === "server_user_list" ) {
        //Populate the list of users already connected. This is for
        //a new client who needs the whole list of current users.

        //Create an empty array of connected users.
        parent.CurrentUsers.state.userlist = [];

        //Map the provided user list to the array of users.
        inMessage.user_list.map( (user) => {
          parent.CurrentUsers.state.userlist.push({
            username: user.username,
            user_icon: user.username.charAt(0).toUpperCase(),
            user_color: getColor( user.username.charAt(0).toUpperCase() ),
            UID: parent.CurrentUsers.UID.generateUID('users')
          });
        });

        //Have React render the user lists.
        parent.CurrentUsers.setState( parent.CurrentUsers.state.userlist );
      }
    });
  }

  //Call upon React being ready to attach event listeners to the component.
  componentDidMount() {
    this.setState( this.state.userlist );
    let parent = this;

    //Attach the Websocket listener events to this React component.
    this.state.websocket.addEventListener('message', function(event) {
      //Parse the JSON object.
      const inMessage = JSON.parse( event.data );

      //Check the event type to determine how the message should be acted upon.
      if( inMessage.event === "server_new_user" ) {
        //Add a new user to the list of users.
        parent.state.userlist.push({
          username: inMessage.username,
          user_icon: inMessage.username.charAt(0).toUpperCase(),
          user_color: getColor( inMessage.username.charAt(0).toUpperCase() ),
          UID: parent.UID.generateUID('users')
        });
        
        //Have React render the user lists.
        parent.setState( parent.state.userlist );
      } else if( inMessage.event === "server_remove_user" ) {
        //Remove a user who has disconnected.
        let held_index;

        //Iterate through the list of users and remove that user.
        parent.state.userlist.forEach( (element, index ) => {
          if( element.username == inMessage.username ) {
            held_index = element.UID;
            parent.state.userlist.splice( index, 1 );
          }
        });

        //Have React render the user lists.
        parent.setState( parent.state.userlist );

        //Retire that user's ID.
        parent.UID.retireUID( 'users', held_index );
      } else if( inMessage.event === "server_user_list" ) {
        //Populate the list of users already connected. This is for
        //a new client who needs the whole list of current users.

        //Create an empty array of connected users.
        parent.state.userlist = [];

        //Map the provided user list to the array of users.
        inMessage.user_list.map( (user) => {
          parent.state.userlist.push({
            username: user.username,
            user_icon: user.username.charAt(0).toUpperCase(),
            user_color: getColor( user.username.charAt(0).toUpperCase() ),
            UID: parent.UID.generateUID('users')
          });
        });

        //Have React render the user lists.
        parent.setState( parent.state.userlist );
      }
    });
  }

  
  //This function builds and renders the list of available games.
  render() {
    const users_dom = this.state.userlist.map( (user) =>
      <div className='user_wrapper_class' key={user.UID}>
        <div className='user_class'>
          <div className='user_left_class'>
            <div className='user_icon_class' style={user.user_color}>
            {user.user_icon}
            </div>
          </div>
          <div className='user_right_class'>
            <div className='user_username_class'>
              {user.username}
            </div>
            <div className='user_score_class'>
              700
            </div>
          </div>
        </div>
      </div>
    );
    return(
      <div id='user_area' className='user_area_class'>{users_dom}</div>
    );
  }
}