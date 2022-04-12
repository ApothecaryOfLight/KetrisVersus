function getCursorPosition( canvas, event ) {
  let x, y;
  let myCanvas = document.getElementById('myKetrisCanvas');
  let canvasOffsetLeft = myCanvas.offsetLeft;
  let canvasOffsetTop = myCanvas.offsetTop;
  x = event.clientX + document.body.scrollLeft +
    document.documentElement.scrollLeft -
    Math.floor(canvasOffsetLeft);
  y = event.clientY + document.body.scrollTop +
    document.documentElement.scrollTop -
    Math.floor(canvasOffsetTop) + 1;
  return [x,y];
}

function mouse_events(e) {
  let out = getCursorPosition( myKetrisCanvas, e );
  console.log( out[0] + "/" + out[1] );
  if( myGameState.GlobalPlay == true ) {
    if( myGameState.Paused == false ) {
      if( isMobile ) {
        if( out[1] < 305 ) {
          doUpKeyPress();
        } else if( out[1] > 305  ) {
          if( out[0] < 65 ) {
            doLeftKeyPress();
          }
          if(
          out[0] > 65 &&
          out[0] < 130
          ) {
            doDownKeyPress();
          }
          if( out[0] > 130 ) {
            doRightKeyPress();
          }
        }
      } else {
        if( out[0] < 313 ) {
          if( out[1] < (620/2) ) {
            doUpKeyPress();
          }
          if( out[1] > (620/2) && out[1] ) {
            if( out[0] < 310/3 ) {
              doLeftKeyPress();
            }
            if(
              out[0] > (310/3) &&
              out[0] < (310/3)*2
            ) {
              doDownKeyPress();
            }
            if( out[0] > (310/3)*2 ) {
              doRightKeyPress();
            }
          }
        }
      }
    }
  }
  if( myGameState.GameOver == true ) {
    console.log( "Click on Restart Game." );
    if( isMobile ) {
      if( out[0] > 42 && out[0] < 149 ) {
        if( out[1] > 188 && out[1] < 220 ) {
          let restart = JSON.stringify({
            type: 'game_event',
            event: 'client_restart'
          });
          connection.send( restart );
          doStartNewGame();
        }
      }
    } else {
    if( out[0] > 59 && out[0] < 178 ) {
      if( out[1] > 221 && out[1] < 256 ) {
        let restart = JSON.stringify({
          type: 'game_event',
          event: 'client_restart'
        });
        connection.send( restart );
        doStartNewGame();
      }
    }
    }
  }
}

function attach_game_mouse_events() {
  window.addEventListener( 'click', mouse_events );
}

function detach_game_mouse_events() {
  window.removeEventListener( 'click', mouse_events )
}