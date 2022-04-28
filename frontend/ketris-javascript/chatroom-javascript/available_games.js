'use strict';


/*
React component to manage games posted by other players.
*/
class AvailGames extends React.Component {
    constructor( inGames, websocket ) {
      super( inGames, websocket );
      this.state = {...inGames};
      this.UID = new UID;
      window.AvailGames = this;
    }

    updateWebsocket( websocket ) {
      //Attach the Websocket listener events to this React component.
      this.state.websocket = websocket;
      parent.AvailGames.state.inGames.splice(
        0,
        parent.AvailGames.state.inGames.length
      );
      this.state.websocket.addEventListener('message', function(event) {
        //Parse the JSON object.
        const inMessage = JSON.parse( event.data );

        //Check the event type to determine how the message should be acted upon.
        if( inMessage.event === "server_list_game" ) {
          //Add the newly posted game to the list displayed to the user.
          parent.AvailGames.state.inGames.push({
            game_name: inMessage.game_name,
            game_icon: inMessage.game_name.charAt(0).toUpperCase(),
            game_color: getColor( inMessage.game_name.charAt(0).toUpperCase() ),
            game_id: inMessage.game_id,
            UID: inMessage.game_id //guaranteed unique by server
          });

          //Have React render the updated component.
          parent.AvailGames.setState( parent.AvailGames.state.inGames );
        } else if( inMessage.event === "server_delist_game" ) {
          //Iterate through the games listed and remove the game that has been delisted.
          parent.AvailGames.state.inGames.forEach( ( element, index ) => {
            if( element.game_id === inMessage.game_id ) {
              parent.AvailGames.state.inGames.splice( index, 1 );
            }
          });
          parent.AvailGames.setState( parent.AvailGames.state.inGames );
        } else if( inMessage.event === "server_game_list" ) {
          //This object contains a list of all posted games. This is for users who have
          //just logged in, and need that full list.
          //parent.AvailGames.props.inGames = [];

          //Map the received game list into a format React can apply to it's stored list
          //of games.
          inMessage.game_list.map( (game) => {
            parent.AvailGames.state.inGames.push({
              game_name: game.game_name,
              game_icon: game.game_name.charAt(0).toUpperCase(),
              game_color: getColor( game.game_name.charAt(0).toUpperCase() ),
              game_id: game.game_id,
              UID: game.game_id
            });
          });

          //Have React render the updated component.
          parent.AvailGames.setState( parent.AvailGames.state.inGames );
        }
      });
    }


    //Call upon React being ready to attach event listeners to the component.
    componentDidMount() {
      this.setState( this.state.inGames );
      let parent = this;

      //Attach the Websocket listener events to this React component.
      this.state.websocket.addEventListener('message', function(event) {
        //Parse the JSON object.
        const inMessage = JSON.parse( event.data );

        //Check the event type to determine how the message should be acted upon.
        if( inMessage.event === "server_list_game" ) {
          //Add the newly posted game to the list displayed to the user.
          parent.state.inGames.push({
            game_name: inMessage.game_name,
            game_icon: inMessage.game_name.charAt(0).toUpperCase(),
            game_color: getColor( inMessage.game_name.charAt(0).toUpperCase() ),
            game_id: inMessage.game_id,
            UID: inMessage.game_id //guaranteed unique by server
          });

          //Have React render the updated component.
          parent.setState( parent.state.inGames );
        } else if( inMessage.event === "server_delist_game" ) {
          //Iterate through the games listed and remove the game that has been delisted.
          parent.state.inGames.forEach( ( element, index ) => {
            if( element.game_id === inMessage.game_id ) {
              parent.state.inGames.splice( index, 1 );
            }
          });
          parent.setState( parent.state.inGames );
        } else if( inMessage.event === "server_game_list" ) {
          //This object contains a list of all posted games. This is for users who have
          //just logged in, and need that full list.
          parent.state.inGames = [];

          //Map the received game list into a format React can apply to it's stored list
          //of games.
          inMessage.game_list.map( (game) => {
            parent.state.inGames.push({
              game_name: game.game_name,
              game_icon: game.game_name.charAt(0).toUpperCase(),
              game_color: getColor( game.game_name.charAt(0).toUpperCase() ),
              game_id: game.game_id,
              UID: game.game_id
            });
          });

          //Have React render the updated component.
          parent.setState( parent.state.inGames );
        }
      });
    };


    //This event is to be called when this user joins a posted game.
    join_game( inGameID, inGameName ) {
      this.state.websocket.send(JSON.stringify({
        event: "client_enter_game",
        game_id: inGameID,
        game_name: inGameName
      }));
    }


    //This function builds and renders the list of available games.
    render() {
      const avail_games_dom = this.state.inGames.map( (avail_game) =>
        <div className='avail_game_wrapper_class' key={avail_game.UID}>
          <div className='avail_game_class'>
            <div className='avail_game_left_class'>
              <div className='avail_game_icon_class' style={avail_game.game_color}>
                {avail_game.game_icon}
              </div>
              <div className='avail_game_username_class'>
                Started By: {avail_game.game_name}
              </div>
              <div className='avail_game_timestamp_class'>
                Timestamp
              </div>
            </div>
            <div className='avail_game_right_class'>
              <button className='avail_game_join_game_button_class button_class'
                onClick={()=> this.join_game(avail_game.game_id,avail_game.game_name) }
              >
                Join Game
              </button>
            </div>
          </div>
        </div>
      );
      return(
        <div id='avail_games_area' className='avail_games_area_class'>{avail_games_dom}</div>
      );
    }
  }