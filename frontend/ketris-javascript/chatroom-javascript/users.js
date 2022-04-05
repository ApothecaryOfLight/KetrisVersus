'use strict';

class CurrentUsers extends React.Component {
    constructor( userlist, websocket ) {
      super( userlist, websocket );
      this.state = {...userlist};
      this.UID = new UID;
    }
    componentDidMount() {
      this.setState( this.state.userlist );
      let parent = this;
      this.state.websocket.addEventListener('message', function(event) {
        const inMessage = JSON.parse( event.data );
        if( inMessage.event === "server_new_user" ) {
          parent.state.userlist.push({
            username: inMessage.username,
            user_icon: inMessage.username.charAt(0).toUpperCase(),
            user_color: getColor( inMessage.username.charAt(0).toUpperCase() ),
            UID: parent.UID.generateUID('users')
          });
          parent.setState( parent.state.userlist );
        } else if( inMessage.event === "server_remove_user" ) {
      let held_index;
          parent.state.userlist.forEach( (element, index ) => {
            if( element.username == inMessage.username ) {
              held_index = element.UID;
              parent.state.userlist.splice( index, 1 );
            }
          });
          parent.setState( parent.state.userlist );
      parent.UID.retireUID( 'users', held_index );
        } else if( inMessage.event === "server_user_list" ) {
          parent.state.userlist = [];
          inMessage.user_list.map( (user) => {
            parent.state.userlist.push({
              username: user.username,
              user_icon: user.username.charAt(0).toUpperCase(),
              user_color: getColor( user.username.charAt(0).toUpperCase() ),
              UID: parent.UID.generateUID('users')
            });
          });
          parent.setState( parent.state.userlist );
        }
      });
    }
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