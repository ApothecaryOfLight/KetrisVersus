'use strict';

class AvailGames extends React.Component {
    constructor( inGames, websocket ) {
      super( inGames, websocket );
      this.state = {...inGames};
      this.UID = new UID;
    }
    componentDidMount() {
      this.setState( this.state.inGames );
      let parent = this;
      this.state.websocket.addEventListener('message', function(event) {
        const inMessage = JSON.parse( event.data );
        console.dir( inMessage );
        if( inMessage.event === "server_list_game" ) {
          console.log( "server_list_game event!" );
          parent.state.inGames.push({
            game_name: inMessage.game_name,
            game_icon: inMessage.game_name.charAt(0).toUpperCase(),
            game_color: getColor( inMessage.game_name.charAt(0).toUpperCase() ),
            game_id: inMessage.game_id,
            UID: inMessage.game_id //guaranteed unique by server
          });
          parent.setState( parent.state.inGames );
        } else if( inMessage.event === "server_delist_game" ) {
          parent.state.inGames.forEach( ( element, index ) => {
            if( element.game_id === inMessage.game_id ) {
              parent.state.inGames.splice( index, 1 );
            }
          });
          parent.setState( parent.state.inGames );
        } else if( inMessage.event === "server_game_list" ) {
          parent.state.inGames = [];
          inMessage.game_list.map( (game) => {
            parent.state.inGames.push({
              game_name: game.game_name,
              game_icon: game.game_name.charAt(0).toUpperCase(),
              game_color: getColor( game.game_name.charAt(0).toUpperCase() ),
              game_id: game.game_id,
              UID: game.game_id
            });
          });
          parent.setState( parent.state.inGames );
        }
      });
    };
    join_game( inGameID, inGameName ) {
      console.log( "Joining game ID: " + inGameID + " GameName: " + inGameName + "." );
      this.state.websocket.send(JSON.stringify({
        event: "client_enter_game",
        game_id: inGameID,
        game_name: inGameName
      }));
    }
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